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

  api: ResourceApi<T>;
  modelStore: ResourceModelStore<T>;
  permanentQuery: ResourceListQuery;

  @observable
  models: IObservableArray<T> = [] as any;
  @observable
  meta: ResourceListMeta = {};
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

  private currentRequest: CancellablePromise | undefined;

  constructor(
    api: ResourceApi<T>,
    modelStore: ResourceModelStore<T>,
    permanentQuery: ResourceListQuery = {},
  ) {
    this.api = api;
    this.modelStore = modelStore;
    this.permanentQuery = permanentQuery;

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
  setQuery(query?: ResourceListQuery) {
    if (!deepEqual(query, this.query)) {
      this.query = query;
      this.reset();
    }
  }

  @action.bound
  async changeQuery(query?: ResourceListQuery) {
    this.setQuery(query);
    return this.fetch();
  }

  @action.bound
  async refresh() {
    if (this.isManualRefresh) {
      return false;
    }
    return this.fetch(false, true);
  }

  @action.bound
  async next() {
    if (this.hasNext) {
      return this.fetch(true);
    }
    return false;
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
  // @ts-ignore
  async fetch(
    next = false,
    isManualRefresh = false,
  ): // @ts-ignore
  CancellablePromise<
    (ResourceApiResponse<T> & { data: { models: T[] } }) | boolean
  > {
    if (this.isFetching) {
      return false;
    }
    if (next && !this.hasNext) {
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
      this._performFetch(next),
    ));
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

  _performFetch(next: boolean = false) {
    return async (cancelState: CancelState) => {
      const limit = this.permanentQuery.limit ?? 20;
      const result: ResourceApiResponse<ResourcePage<T>> = await this.api.list({
        ...this.permanentQuery,
        ...this.query,
        limit: limit,
        after: next ? this.meta.nextPageToken : undefined,
      });
      return runInAction(() => {
        if (cancelState.isCanceled) {
          return;
        }
        try {
          if (result.error) {
            this.error = result.error;
            return result;
          } else {
            const total = result.data!.meta.count;
            this.meta = {
              ...this.meta,
              total: total,
              nextPageToken: result.data?.meta.nextPageToken,
              previousPageToken: result.data?.meta.previousPageToken,
            };
            const models = this.modelStore.upsert(result.data!.data);
            if (next) {
              this.models.push(...models);
            } else {
              this.models.replace(models);
            }
            return new ResourceApiResponse({
              ...result.data,
              models: this.models,
            });
          }
        } finally {
          this.isFetching = false;
          this.isManualRefresh = false;
        }
      });
    };
  }
}
