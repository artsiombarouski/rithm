import { DEFAULT_PRIMARY, ResourceModel } from './ResourceModel';
import {
  action,
  computed,
  IObservableArray,
  makeObservable,
  observable,
} from 'mobx';
import {
  CreateOptions,
  FindOptions,
  GetOptions,
  Id,
  SetOptions,
} from './types';
import { difference, intersection, isEmpty, isObject } from 'lodash';
import EventEmitter from 'events';
import { ResourceApi, ResourceApiResponse, ResourceQuery } from './api';
import { ResourceModelStoreRegister } from './ResourceModelStoreRegister';

type IndexTree<T> = Map<string, Index<T>>;
type Index<T> = Map<any, Array<T>>;
type SyncResult<T> = {
  addedModels?: T[];
  changedModels?: T[];
  removedModels?: T[];
};
type ModelAttributes = { [key: string]: any };

export enum ResourceExtendedActions {
  ModelCreated = 'model_created',
  ModelDeleted = 'model_deleted',
  ModelUpdated = 'model_updated',
  ForceRefresh = 'force_refresh',
}

export class ResourceModelStore<T extends ResourceModel> {
  @observable
  models: IObservableArray<T>;

  private pendingModels: { [key: Id]: T } = {};
  private extendedActionsNotifier = new EventEmitter();

  constructor(
    readonly api: ResourceApi<T>,
    readonly register: ResourceModelStoreRegister,
    data: Array<Object> = [],
  ) {
    this.models = observable.array(data.map((m) => this.build(m)));
    makeObservable(this);
  }

  /*
   * Override this to have more indexes
   */
  get indexes(): Array<string> {
    return [];
  }

  /**
   * Define which is the primary key
   * of the model's in the modelStore.
   *
   * FIXME: This contains a hack to use the `primaryKey` directly
   * from the prototype. Ideally it should be static but that
   * would not be backward compatible and Typescript sucks at
   * static polymorphism (https://github.com/microsoft/TypeScript/issues/5863).
   */
  get primaryKey(): string {
    const ModelClass = this.model();
    if (!ModelClass) {
      return DEFAULT_PRIMARY;
    }
    return ModelClass.prototype.primaryKey;
  }

  /**
   * Returns a hash with all the indexes for that
   * modelStore.
   *
   * We keep the indexes in memory for as long as the
   * modelStore is alive, even if no one is referencing it.
   * This way we can ensure to calculate it only once.
   */
  @computed({ keepAlive: true })
  get index(): IndexTree<T> {
    const indexes = this.indexes.concat([this.primaryKey]);

    return indexes.reduce((tree: IndexTree<T>, attr: string) => {
      const newIndex = this.models.reduce((index: Index<T>, model: T) => {
        const value = model.has(attr) ? model.get(attr) : null;
        const oldModels = index.get(value) || [];

        return index.set(value, oldModels.concat(model));
      }, new Map());

      const result = tree.set(attr, newIndex);
      this.pendingModels = {};
      return result;
    }, new Map());
  }

  /**
   * Alias for models.length
   */
  @computed
  get length(): Number {
    return this.models.length;
  }

  /**
   * Alias for models.map
   */
  map<P>(callback: (model: T) => P): Array<P> {
    return this.models.map(callback);
  }

  /**
   * Alias for models.forEach
   */
  forEach(callback: (model: T) => void): void {
    return this.models.forEach(callback);
  }

  /**
   * Returns the URL where the model's resource would be located on the server.
   */
  url(): string | null {
    return null;
  }

  /**
   * Specifies the model class for that modelStore
   */
  model(attributes?: ModelAttributes): any {}

  /**
   * Returns a JSON representation
   * of the modelStore
   */
  toJS(): Array<ModelAttributes> {
    return this.models.map((model) => model.toJS());
  }

  /**
   * Alias of slice
   */
  toArray(): Array<T> {
    return this.slice();
  }

  /**
   * Returns a defensive shallow array representation
   * of the modelStore
   */
  slice(): Array<T> {
    return this.models.slice();
  }

  /**
   * Whether the modelStore is empty
   */
  @computed
  get isEmpty(): boolean {
    return this.length === 0;
  }

  /**
   * Get a resource at a given position
   */
  at(index: number): T | null {
    return this.models[index];
  }

  /**
   * Get a resource with the given id or uuid
   */
  get(id: Id, { required = false }: GetOptions = {}): T | undefined {
    const models = this.index.get(this.primaryKey)!.get(id);
    const model = (models && models[0]) ?? this.pendingModels[id];

    if (!model && required) {
      throw new Error(
        `Invariant: ${this.model().name} must be found with ${
          this.primaryKey
        }: ${id}`,
      );
    }

    return model;
  }

  /**
   * Get or create new model (without updating existing model)
   */
  obtain(id: Id, data: {} = {}): T {
    let model = this.get(id);
    if (!model) {
      model = this.build({ [this.primaryKey]: id, ...data });
      this.add(model);
    }
    return model;
  }

  /**
   * Get or create new model (with updating existing model)
   */
  resolve(data: { [key: string]: any } = {}, upsert?: boolean): T | undefined {
    const id = data[this.primaryKey];
    if (!id) {
      return;
    }
    let model: T | undefined = this.get(id);
    if (!model) {
      model = this.build(data);
      this.add(model);
    } else if (upsert) {
      model.set(data);
    }
    return model;
  }

  mutate(id: Id, data?: Object | T): T {
    let model = this.get(id);
    if (model) {
      return model.mutate();
    }
    // If model don't exist - just create new instance
    return this.build(data) as T;
  }

  /**
   * Get resources matching criteria.
   *
   * If passing an object of key:value conditions, it will
   * use the indexes to efficiently retrieve the data.
   */
  filter(query: { [key: string]: any } | ((query: T) => boolean)): Array<T> {
    if (typeof query === 'function') {
      return this.models.filter((model) => query(model));
    } else {
      // Sort the query to hit the indexes first
      const optimizedQuery = Object.entries(query).sort(
        (A, B) => Number(this.index.has(B[0])) - Number(this.index.has(A[0])),
      );

      return (
        optimizedQuery.reduce(
          (values: Array<T> | null, [attr, value]): Array<T> => {
            // Hitting index
            if (this.index.has(attr)) {
              const newValues = this.index.get(attr)!.get(value) || [];
              return values ? intersection(values, newValues) : newValues;
            } else {
              // Either Re-filter or Full scan
              const target = values || this.models;
              return target.filter(
                (model: T) => model.has(attr) && model.get(attr) === value,
              );
            }
          },
          null,
        ) ?? []
      );
    }
  }

  /**
   * Finds an element with the given matcher
   */
  find(
    query: { [key: string]: any } | ((query: T) => boolean),
    { required = false }: FindOptions = {},
  ): T | undefined {
    const model =
      typeof query === 'function'
        ? this.models.find((model) => query(model))
        : this.filter(query)[0];

    if (!model && required) {
      throw new Error(`Invariant: ${this.model().name} must be found`);
    }

    return model;
  }

  /**
   * Returns the last element of the modelStore
   */
  last(): T | null {
    const length = this.models.length;
    if (length === 0) return null;

    return this.models[length - 1];
  }

  /**
   * Adds a model or modelStore of models.
   */
  @action
  add(
    data: Array<{ [key: string]: any } | T> | { [key: string]: any } | T,
  ): Array<T> {
    if (!Array.isArray(data)) data = [data];

    const models = difference(
      data.map((m: {}) => this.build(m)),
      this.models,
    );

    this.models.push(...models);

    return models;
  }

  /**
   * Adds a model or modelStore of models to begin of list
   */
  @action
  unshift(data: Array<{ [key: string]: any }> | { [key: string]: any }) {
    if (!Array.isArray(data)) data = [data];

    const models = difference(
      data.map((m: {}) => this.build(m)),
      this.models,
    );

    this.models.unshift(...models);
    return models;
  }

  /**
   * Resets the modelStore of models.
   */
  @action
  reset(data: Array<{ [key: string]: any }>): void {
    this.models.replace(data.map((m) => this.build(m)));
  }

  /**
   * Removes the model with the given ids or uuids
   */
  @action
  remove(ids: Id | T | Array<Id | T>): T[] {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    const toKeep: Set<T> = new Set(this.models);
    const removed: Set<T> = new Set([]);

    ids.forEach((id) => {
      let model: T | undefined;

      if (id instanceof ResourceModel && (id as any).modelStore === this) {
        model = id;
      } else if (typeof id === 'number' || typeof id === 'string') {
        model = this.get(id);
      }

      if (!model) {
        console.warn(
          `${this.constructor.name}: ${this.model().name} with ${
            this.primaryKey
          } ${id} not found.`,
        );
      } else {
        toKeep.delete(model);
        // (model as any).modelStore = undefined;
        removed.add(model);
      }
    });

    this.models.replace(Array.from(toKeep));
    const result = [...removed];
    this.onRemoved(result);
    return result;
  }

  onRemoved(models: T[]) {}

  /**
   * Sets the resources into the modelStore.
   *
   * You can disable adding, changing or removing.
   */
  @action
  sync(
    resources: Array<Object | T>,
    { add = true, change = true, remove = true }: SetOptions = {},
  ): SyncResult<T> {
    const idsToRemove: Set<IterableIterator<any> | null> = new Set(
      this.index.get(this.primaryKey)?.keys(),
    );
    const resourcesToAdd: Set<Object | T> = new Set([]);

    const result: SyncResult<T> = {};

    idsToRemove.delete(null);

    resources.forEach((resource) => {
      const id: any = (resource as any)[this.primaryKey];
      const model = id ? this.get(id) : null;

      if (!model) {
        resourcesToAdd.add(resource);
      } else {
        if (remove) {
          idsToRemove.delete(id);
        }
        if (change) {
          if (!result.changedModels) {
            result.changedModels = [];
          }
          result.changedModels.push(model);
          model.set(
            resource instanceof ResourceModel ? resource.toJS() : resource,
          );
          model.commitChanges();
        }
      }
    });

    if (remove && idsToRemove.size) {
      result.removedModels = this.remove(Array.from(idsToRemove) as any);
    }

    if (add && resourcesToAdd.size) {
      result.addedModels = this.add(Array.from(resourcesToAdd));
    }
    return result;
  }

  /**
   * Process all provided resources and return updated existing
   * model or crate a new one
   */
  @action
  upsert(resources: Array<Object | T>): T[] {
    if (isEmpty(resources)) {
      return [];
    }
    const createdModels: T[] = [];
    if (!Array.isArray(resources)) {
      resources = [resources] as any;
    }
    const result = resources.map((attributes) => {
      const id = (attributes as any)[this.primaryKey];
      if (!id) {
        throw new Error(
          `Can't upsert without primary key in attributes: ${JSON.stringify(
            attributes,
          )}`,
        );
      }
      let model = this.get(id);
      if (!model) {
        model = this.build({ [this.primaryKey]: id });
        createdModels.push(model);
        this.pendingModels[id] = model;
      }
      model.set(attributes);
      model.commitChanges();
      return model;
    });
    this.models.push(...createdModels);
    return result;
  }

  /**
   * Creates a new model instance with the given attributes
   */
  build(attributes: Object | T = {}): T {
    if (attributes instanceof ResourceModel) {
      (attributes as any).modelStore = this;
      return attributes as T;
    }

    const ModelClass = this.model(attributes);
    const model: ResourceModel = new ModelClass(this, attributes);

    return model as T;
  }

  /**
   * Creates the model and saves it on the backend
   *
   * The default behaviour is optimistic but this
   * can be tuned.
   */

  @action.bound
  async create(
    attributesOrModel: { [key: string]: any } | T,
    { optimistic = false, path }: CreateOptions = {},
  ): Promise<ResourceApiResponse<T>> {
    const model = this.build(attributesOrModel);

    return model.save({ optimistic, path });
  }

  /**
   * Call an RPC action for all those
   * non-REST endpoints that you may have in
   * your API.
   */
  @action.bound
  async rpc(
    endpoint: string | { rootUrl: string },
    query?: ResourceQuery,
  ): Promise<any> {
    const url = isObject(endpoint)
      ? (endpoint as any).rootUrl
      : `${this.url()}/${endpoint}`;

    return this.api.post(url, query);
  }

  notifyExtendedAction(
    action: ResourceExtendedActions | string,
    payload: any = undefined,
    data: any = undefined,
  ) {
    this.extendedActionsNotifier.emit(action, payload, data);
  }

  listenExtendedActions<PayloadT = any>(
    action: ResourceExtendedActions | string,
    callback: (payload: PayloadT) => any,
  ): () => void {
    this.extendedActionsNotifier.addListener(action, callback);
    return () => {
      this.extendedActionsNotifier.removeListener(action, callback);
    };
  }
}
