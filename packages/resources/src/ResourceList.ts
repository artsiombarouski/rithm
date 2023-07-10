import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
  observe,
  runInAction,
} from 'mobx';
import { isUndefined } from 'lodash';
import deepEqual from 'deep-equal';
import {
  CancellablePromise,
  CancelState,
  createCancellablePromise,
} from '@artsiombarouski/rn-services';
import { ResourceModel } from './ResourceModel';
import {
  ResourceApi,
  ResourceApiError,
  ResourceApiResponse,
  ResourceListQuery,
  ResourcePage,
} from './api';
import {
  ResourceExtendedActions,
  ResourceModelStore,
} from './ResourceModelStore';
import { ResourceListMeta } from './types';
import { isNothing } from './utils';

export class ResourceList<T extends ResourceModel> {
  static _cached: { [key: string]: ResourceList<any> } = {};

  static ofKey<T extends ResourceModel>(
    key: string | undefined,
    builder: () => ResourceList<T>,
  ): ResourceList<T> {
    if (key && this._cached[key]) {
      return this._cached[key];
    }
    const list = builder();
    if (key) {
      this._cached[key] = list;
    }
    return list;
  }

  @observable
  meta: ResourceListMeta = {};
  @observable
  models: IObservableArray<T> = [] as any;
  @observable
  isFetching: boolean = false;
  @observable
  isInitialLoaded: boolean = false;
  @observable
  isManualRefresh: boolean = false;
  @observable
  query: ResourceListQuery | undefined;
  @observable
  error: ResourceApiError | null | undefined;
  @observable
  currentFetchQuery: ResourceListQuery | undefined;

  private currentRequest: CancellablePromise | undefined;

  constructor(
    readonly api: ResourceApi<T>,
    readonly modelStore: ResourceModelStore<T>,
    readonly permanentQuery: ResourceListQuery = {},
  ) {
    makeObservable(this);

    // In case when resource was deleted, we should also delete it from list
    observe(this.modelStore.models, (change) => {
      if (change.type === 'splice' && change.removed) {
        const toRemove = change.added
          ? change.removed.filter((e) => !change.added.includes(e))
          : change.removed;
        this.models.replace(this.models.filter((e) => !toRemove.includes(e)));
      }
    });

    // Can be useful in case when user created new content, and we need to refresh all lists
    this.modelStore.listenExtendedActions(
      ResourceExtendedActions.ForceRefresh,
      this.refresh,
    );
  }

  @computed
  get isEmpty() {
    return this.models.length === 0;
  }

  @computed
  get isLoading() {
    return this.isFetching;
  }

  @computed
  get isLoadingOrInitialLoading() {
    return this.isLoading || !this.isInitialLoaded;
  }

  @computed
  get canShowEmpty() {
    return this.isEmpty && isNothing(this.error);
  }

  @computed
  get canShowError() {
    return !this.isLoadingOrInitialLoading && this.isEmpty && this.error;
  }

  @computed
  get isRefreshing() {
    return !this.isEmpty && this.isFetching;
  }

  @computed
  get isManualRefreshing() {
    return this.isManualRefresh && this.isRefreshing;
  }

  @computed
  get hasNext() {
    return !isUndefined(this.meta?.nextPageToken);
  }

  @computed
  get hasPrevious() {
    return !isUndefined(this.meta?.previousPageToken);
  }

  @computed
  get data(): T[] {
    return this.models.slice();
  }

  @computed
  get first(): T | undefined {
    return this.isEmpty ? undefined : this.models[0];
  }

  @action
  clear() {
    this.models.clear();
  }

  @action
  unshift(model: T) {
    this.meta = {
      ...this.meta,
      total: (this.meta.total ?? 0) + 1,
    };
    this.models.unshift(model);
  }

  @action
  remove(model: T) {
    this.meta = {
      ...this.meta,
      total: (this.meta.total ?? 0) - 1,
    };
    this.models.remove(model);
  }

  find(predicate: (e: T) => boolean) {
    return this.data.find(predicate);
  }

  @action
  setQuery(query?: ResourceListQuery): boolean {
    if (!deepEqual(query, this.query)) {
      this.query = query;
      this.reset();
      return true;
    }
    return false;
  }

  @action.bound
  async changeQuery(query?: ResourceListQuery) {
    if (this.setQuery(query)) {
      this.setQuery(query);
      return this.fetch({ replaceData: true });
    }
    return false;
  }

  @action.bound
  async refresh() {
    if (this.isManualRefresh) {
      return false;
    }
    return this.fetch({
      replaceData: true,
      isManualRefresh: true,
    });
  }

  @action.bound
  async next(replaceData: boolean = false) {
    if (this.hasNext) {
      return this.fetch({ next: true, replaceData: replaceData });
    }
    return false;
  }

  @action.bound
  async previous(replaceData: boolean = false) {
    if (this.hasPrevious) {
      return this.fetch({ previous: true, replaceData: replaceData });
    }
    return false;
  }

  @action.bound
  async nextPage() {
    if (this.hasNext) {
      return this.next(true);
    }
    return false;
  }

  @action.bound
  async goToPage(page: string | number) {
    return this.fetch({ after: page.toString(), replaceData: true });
  }

  @action.bound
  async previousPage() {
    if (this.hasPrevious) {
      return this.previous(true);
    }
    return false;
  }

  @computed
  get totalPages(): number | undefined {
    return this.meta.totalPages;
  }

  @computed
  get currentPage(): number | undefined {
    try {
      if (this.currentFetchQuery?.after) {
        return parseInt(this.currentFetchQuery.after);
      }
      if (this.currentFetchQuery?.before) {
        return parseInt(this.currentFetchQuery.before);
      }
      return this.meta.page;
    } catch (e) {
      return undefined;
    }
  }

  @action
  reset() {
    this.cancelCurrentRequest();
    this.clear();
  }

  @action
  cancelCurrentRequest() {
    this.isFetching = false;
    this.isManualRefresh = false;
    this.currentRequest?.cancel();
    this.currentRequest = undefined;
  }

  @action.bound
  async fetch(
    options: {
      next?: boolean;
      previous?: boolean;
      replaceData?: boolean;
      isManualRefresh?: boolean;
    } & ResourceListQuery = {},
  ): // @ts-ignore
  CancellablePromise<
    (ResourceApiResponse<T> & { data: { models: T[] } }) | boolean
  > {
    const {
      next = false,
      previous = false,
      replaceData = true,
      isManualRefresh = false,
      ...restQuery
    } = options ?? {};
    if (this.isFetching) {
      return false;
    }
    if (next && !this.hasNext) {
      return false;
    }
    if (previous && !this.hasPrevious) {
      return false;
    }
    this.cancelCurrentRequest();
    runInAction(() => {
      this.error = null;
      this.isFetching = true;
      this.isInitialLoaded = true;
      this.isManualRefresh = isManualRefresh;
    });
    return (this.currentRequest = createCancellablePromise<any>(
      this._performFetch({
        next,
        previous,
        replaceData,
        ...restQuery,
      }),
    ));
  }

  _performFetch(
    options: {
      next?: boolean;
      previous?: boolean;
      replaceData?: boolean;
    } & ResourceListQuery,
  ) {
    const {
      next = false,
      previous = false,
      replaceData = false,
      ...restQuery
    } = options;
    return async (cancelState: CancelState) => {
      const limit = this.query?.limit ?? this.permanentQuery.limit ?? 20;
      const fetchQuery: ResourceListQuery = {
        ...this.permanentQuery,
        limit: limit,
        after: next ? this.meta.nextPageToken : undefined,
        before: previous ? this.meta.previousPageToken : undefined,
        ...this.query,
        ...restQuery,
      };
      runInAction(() => {
        this.currentFetchQuery = fetchQuery;
      });
      const result: ResourceApiResponse<ResourcePage<T>> = await this.api.list(
        fetchQuery,
      );
      return runInAction(() => {
        if (cancelState.isCanceled) {
          return;
        }
        try {
          if (result.error) {
            this.error = result.error;
            return result;
          } else {
            const resultData = result.data!;
            const total = resultData.meta.count;
            this.meta = {
              ...this.meta,
              ...resultData.meta,
              total: total,
            };
            const models = this.modelStore.upsert(resultData.data);
            if (replaceData) {
              this.models.replace(models);
            } else {
              this.models.push(...models);
            }
            return new ResourceApiResponse({
              ...resultData,
              models: this.models,
            });
          }
        } finally {
          this.isFetching = false;
          this.isManualRefresh = false;
          this.currentFetchQuery = undefined;
        }
      });
    };
  }
}
