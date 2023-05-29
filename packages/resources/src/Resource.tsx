import { ResourceList } from './ResourceList';
import { ResourceModelStore } from './ResourceModelStore';
import { ResourceModel } from './ResourceModel';
import { ResourceApi, ResourceListQuery } from './api';

export class Resource<T extends ResourceModel> {
  private _modelStore?: ResourceModelStore<T>;

  constructor(
    readonly modelGetter: () => any,
    readonly api: ResourceApi<T>,
    modelStore?: ResourceModelStore<T>,
  ) {
    this._modelStore = modelStore;
  }

  get store(): ResourceModelStore<T> {
    if (!this._modelStore) {
      const getter = this.modelGetter;

      class Store extends ResourceModelStore<T> {
        model(attributes?: { [p: string]: any }): any {
          return getter();
        }
      }

      this._modelStore = new Store(this.api);
    }
    return this._modelStore!;
  }

  createList(query?: ResourceListQuery): ResourceList<T> {
    return new ResourceList<T>(this.api, this.store, query);
  }
}
