import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
  runInAction,
} from 'mobx';
import fromEntries from 'object.fromentries';
import { DestroyOptions, Id, OptimisticId, SaveOptions } from './types';
import {
  ResourceExtendedActions,
  ResourceModelStore,
} from './ResourceModelStore';
import {
  applyPatchChanges,
  getChangedAttributesBetween,
  getChangesBetween,
  isNothing,
} from './utils';
import { includes, isEmpty, uniqueId } from 'lodash';
import { ResourceApiError, ResourceApiResponse, ResourceQuery } from './api';

export interface ResourceReferences {
  [key: string]: {
    store: ResourceModelStore<any>;
    canSave?: boolean;
    canUpdate?: boolean;
  };
}

export type ResourceAttributes = {
  [key: string]: any;
};

export const DEFAULT_PRIMARY = 'id';

let _lastDebugKey = 0;

export class ResourceModel<IdType extends Id = any> {
  private readonly _debugKey: number;

  private modelStore: ResourceModelStore<this> | undefined | null;

  private readonly attributes: ObservableMap;
  private readonly committedAttributes: ObservableMap;

  private parentModel: this | undefined;
  private optimisticId: OptimisticId = uniqueId('i_');

  @observable
  isSaving: boolean = false;
  @observable
  isFetching: boolean = false;
  @observable
  isDestroying: boolean = false;
  @observable
  isDestroyed: boolean = false;

  private mutateDispatchers = {
    add: () => {
      if (this.parentModel) {
        this.parentModel?.modelStore?.add(this.parentModel);
      } else {
        this.modelStore?.add(this);
      }
    },
    update: (data: {}) => {
      this.set(data);
      this.parentModel?.set(data);
    },
    commit: (data: {}) => {
      this.set(data);
      this.commitChanges();
      this.parentModel?.set(data);
      this.parentModel?.commitChanges();
    },
    remove: () => {
      if (this.parentModel) {
        this.parentModel?.modelStore?.remove(this.parentModel);
      } else {
        this.modelStore?.remove(this);
      }
    },
    notifyAdded: () => {
      if (this.parentModel) {
        this.parentModel?.modelStore?.notifyExtendedAction(
          ResourceExtendedActions.ModelCreated,
          this.parentModel,
        );
      } else {
        this.modelStore?.notifyExtendedAction(
          ResourceExtendedActions.ModelCreated,
          this,
        );
      }
    },
    notifyRemoved: () => {
      if (this.parentModel) {
        this.parentModel?.modelStore?.notifyExtendedAction(
          ResourceExtendedActions.ModelDeleted,
          this.parentModel,
        );
      } else {
        this.modelStore?.notifyExtendedAction(
          ResourceExtendedActions.ModelDeleted,
          this,
        );
      }
    },
  };

  constructor(
    attributes: ResourceAttributes = {},
    readonly references?: ResourceReferences,
  ) {
    this._debugKey = ++_lastDebugKey;
    makeObservable(this);

    const mergedAttributes = {
      ...attributes,
    };

    this.attributes = observable.map(mergedAttributes);
    this.committedAttributes = observable.map(mergedAttributes);

    if (this.references) {
      Object.entries(this.references).forEach(([key, reference]) => {
        const attrValue = mergedAttributes[key];
        if (attrValue) {
          reference.store.upsert(attrValue);
        }
      });
    }
  }

  get debugKey(): number {
    return this._debugKey;
  }

  mutate<T>(): T {
    if (!this.modelStore) {
      throw new Error('ModelStore is not defined');
    }
    const ModelClass = this.modelStore.model();
    const copy = new ModelClass(Object.fromEntries(this.attributes.entries()));
    copy.parentModel = this;
    return copy;
  }

  /**
   * Returns a JSON representation
   * of the model
   */
  toJS() {
    return fromEntries(this.attributes);
  }

  get key(): Id {
    return this.get(this.primaryKey)!;
  }

  /**
   * Define which is the primary
   * key of the model.
   */
  get primaryKey(): string {
    return DEFAULT_PRIMARY;
  }

  /**
   * Return the base url used in
   * the `url` method
   */
  urlRoot(): string | null {
    return null;
  }

  /**
   * Return the url for this given REST resource
   */
  url(): string {
    let urlRoot = this.urlRoot();

    if (!urlRoot && this.modelStore) {
      urlRoot = this.modelStore.url();
    }

    if (this.isNew) {
      return urlRoot ?? '';
    } else if (urlRoot) {
      return `${urlRoot}/${this.get(this.primaryKey)}`;
    } else {
      return `/${this.get(this.primaryKey)}`;
    }
  }

  fieldModifier<V = any>(fieldName: string) {
    return (value: V) => {
      this.set({ [fieldName]: value });
    };
  }

  /**
   * Whether the resource is new or not
   *
   * We determine this asking if it contains
   * the `primaryKey` attribute (set by the server).
   */
  @computed
  get isNew(): boolean {
    return !this.has(this.primaryKey) || !this.get(this.primaryKey);
  }

  /**
   * Get the attribute from the model.
   *
   * Since we want to be sure changes on
   * the schema don't fail silently we
   * throw an error if the field does not
   * exist.
   *
   * If you want to deal with flexible schemas
   * use `has` to check weather the field
   * exists.
   */
  get<T>(attribute: string): T | undefined {
    if (this.has(attribute)) {
      const raw = this.attributes.get(attribute);
      if (raw && this.references?.[attribute]) {
        const reference = this.references[attribute];
        if (Array.isArray(raw)) {
          return raw.map((e) => reference.store.resolve(e, false)) as any;
        }
        return reference.store.resolve(raw, false);
      }
      return raw;
    }
  }

  /**
   * Returns whether the given field exists
   * for the model.
   */
  has(attribute: string): boolean {
    return this.attributes.has(attribute);
  }

  /**
   * Get an id from the model. It will use either
   * the backend assigned one or the client.
   */
  get id(): IdType {
    return (
      this.has(this.primaryKey) ? this.get(this.primaryKey) : this.optimisticId
    ) as IdType;
  }

  /**
   * Get an array with the attributes names that have changed.
   */
  @computed
  get changedAttributes(): Array<string> {
    return getChangedAttributesBetween(
      fromEntries(this.committedAttributes),
      this.toJS(),
    );
  }

  /**
   * Gets the current changes.
   */
  @computed
  get changes(): { [key: string]: any } {
    return getChangesBetween(
      fromEntries(this.committedAttributes),
      this.toJS(),
    );
  }

  /**
   * If an attribute is specified, returns true if it has changes.
   * If no attribute is specified, returns true if any attribute has changes.
   */
  hasChanges(attribute?: string): boolean {
    if (attribute) {
      return includes(this.changedAttributes, attribute);
    }

    return this.changedAttributes.length > 0;
  }

  @action
  commitChanges(): void {
    const changes = getChangesBetween(
      fromEntries(this.committedAttributes),
      this.toJS(),
    );
    this.committedAttributes.replace(this.toJS());
    if (this.references && !isNothing(changes)) {
      Object.entries(this.references).forEach(([key, reference]) => {
        if (!isNothing(changes[key])) {
          const attrValue = this.attributes.get(key);
          if (attrValue) {
            reference.store.upsert(attrValue);
          }
        }
      });
    }
  }

  @action
  discardChanges(): void {
    this.attributes.replace(fromEntries(this.committedAttributes));
  }

  /**
   * Replace all attributes with new data
   */
  @action
  reset(data: {}): void {
    this.attributes.replace(data ?? {});
  }

  /**
   * Merge the given attributes with
   * the current ones
   */
  @action
  set(data: {}) {
    this.attributes.merge(data);
    return this;
  }

  /**
   * Fetches the model from the backend.
   */
  @action.bound
  async fetch(query?: ResourceQuery): Promise<ResourceApiResponse<this>> {
    runInAction(() => (this.isFetching = true));
    const result = await this.modelStore!.api!.get(this.key, query);
    try {
      if (result.error) {
        return new ResourceApiResponse(this, result.error);
      }
      this.mutateDispatchers.commit(result.data!);
      return new ResourceApiResponse(this);
    } finally {
      runInAction(() => (this.isFetching = false));
    }
  }

  /**
   * Can be used for prepare data before save
   */
  beforeSave(data: {}): void | Promise<void> {}

  /**
   * Saves the resource on the backend.
   *
   * If the item has a `primaryKey` it updates it,
   * otherwise it creates the new resource.
   *
   * It supports optimistic and patch updates.
   */
  @action.bound
  async save(options: SaveOptions = {}): Promise<ResourceApiResponse<this>> {
    const {
      optimistic = false,
      patch = true,
      keepChanges = false,
      path,
      query,
      attributes,
    } = options;

    const currentAttributes = this.toJS();
    const isNew = this.isNew;

    runInAction(() => (this.isSaving = true));

    let data: {};
    if (patch && !isEmpty(attributes) && !isNew) {
      data = attributes;
    } else if (patch && !isNew) {
      data = this.changes;
    } else {
      data = { ...currentAttributes, ...attributes };
    }

    let apiMethod: string;

    if (isNew) {
      apiMethod = 'postRest'; //TODO: fix this reference
    } else if (patch) {
      apiMethod = 'patchRest'; //TODO: fix this reference
    } else {
      apiMethod = 'putRest'; //TODO: fix this reference
    }

    let fallbacks: (() => void)[] = [];
    if (optimistic) {
      if (attributes) {
        const updateAttributes = patch
          ? applyPatchChanges(currentAttributes, attributes)
          : attributes;
        this.mutateDispatchers.update(updateAttributes);
        fallbacks.push(() => this.mutateDispatchers.update(currentAttributes));
      }
      this.mutateDispatchers.add();
      if (isNew) {
        fallbacks.push(this.mutateDispatchers.remove);
      }
    }

    try {
      //TODO: not work properly if optimistic
      await this.beforeSave(data);
      const targetPath = path || this.url() || '';

      const result: ResourceApiResponse<this> = await (
        this.modelStore!.api as any
      )[apiMethod](targetPath, data, query);

      if (result.error) {
        runInAction(() => {
          fallbacks.forEach((fn) => fn());
        });
        return new ResourceApiResponse(this, result.error);
      }

      const changes = getChangesBetween(currentAttributes, this.toJS());

      runInAction(() => {
        this.mutateDispatchers.commit(result.data!);

        if (!optimistic) {
          this.mutateDispatchers.add();
        }

        if (keepChanges) {
          const patchChanges = applyPatchChanges(result.data!, changes);
          this.mutateDispatchers.update(patchChanges);
        }
      });
      if (isNew) {
        this.mutateDispatchers.notifyAdded();
      }
      return new ResourceApiResponse(this);
    } catch (error) {
      console.log(error);
      runInAction(() => {
        fallbacks.forEach((fn) => fn());
      });
      return new ResourceApiResponse(this, ResourceApiError.unknown);
    } finally {
      runInAction(() => (this.isSaving = false));
    }
  }

  /**
   * Destroys the resource on the client and
   * requests the backend to delete it there
   * too
   */
  @action.bound
  async destroy(
    options: DestroyOptions = {},
  ): Promise<ResourceApiResponse<this>> {
    const { optimistic = false, query = {}, path = undefined } = options;

    if (this.isNew) {
      this.mutateDispatchers.remove();
      return new ResourceApiResponse<this>(this);
    }

    runInAction(() => (this.isDestroying = true));

    let fallback;
    if (optimistic) {
      this.mutateDispatchers.remove();
      fallback = this.mutateDispatchers.add;
    }

    try {
      const result = await this.modelStore!.api.destroy(
        path || this.get(this.primaryKey),
        query,
      );
      if (result.error) {
        fallback?.();
        return new ResourceApiResponse(this, result.error);
      }
      if (!optimistic) {
        this.mutateDispatchers.remove();
      }
      runInAction(() => (this.isDestroyed = true));
      this.mutateDispatchers.notifyRemoved();
      return new ResourceApiResponse(this);
    } catch (error) {
      fallback?.();
      return new ResourceApiResponse(this, ResourceApiError.unknown);
    } finally {
      runInAction(() => (this.isDestroying = false));
    }
  }

  @action
  destroyInternal() {
    this.isDestroyed = true;
    this.mutateDispatchers.remove();
    this.mutateDispatchers.notifyRemoved();
  }

  @computed
  get hasIdOnly(): boolean {
    return this.attributes.size === 1 && this.has(this.primaryKey);
  }
}
