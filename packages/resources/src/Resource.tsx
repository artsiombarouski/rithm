import { ResourceList } from './ResourceList';
import { ResourceModelStore } from './ResourceModelStore';
import { ResourceModel } from './ResourceModel';
import { ResourceApi, ResourceListQuery } from './api';
import { ResourceModelStoreRegister } from './ResourceModelStoreRegister';

export class Resource<T extends ResourceModel> {
  private readonly _modelStore?: ResourceModelStore<T>;

  constructor(
    readonly modelGetter: () => any,
    readonly api: ResourceApi<T>,
    readonly options?: {
      modelStore?: ResourceModelStore<T>;
      storesRegister?: ResourceModelStoreRegister;
    },
  ) {
    if (options?.modelStore) {
      this._modelStore = options.modelStore;
    } else {
      const getter = this.modelGetter;

      class Store extends ResourceModelStore<T> {
        model(attributes?: { [p: string]: any }): any {
          return getter();
        }
      }

      const register =
        this.options?.storesRegister ?? ResourceModelStoreRegister.global;

      this._modelStore = new Store(this.api, register);
      register.add(getter(), this._modelStore);
    }
  }

  get store(): ResourceModelStore<T> {
    return this._modelStore!;
  }

  createList(query?: ResourceListQuery): ResourceList<T> {
    return new ResourceList<T>(this.api, this.store, query);
  }
}
