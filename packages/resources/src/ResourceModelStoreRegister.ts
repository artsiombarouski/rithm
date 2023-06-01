import { ResourceModelStore } from './ResourceModelStore';
import { ResourceModel } from './ResourceModel';

export class ResourceModelStoreRegister {
  public static global = new ResourceModelStoreRegister();

  private stores: { [key: string]: ResourceModelStore<any> } = {};

  add<T extends ResourceModel>(
    model: new (...args: any[]) => any,
    store: ResourceModelStore<T>,
  ) {
    this.stores[model.name] = store;
  }

  get<T extends ResourceModel>(
    model: new (...args: any[]) => any,
  ): ResourceModelStore<T> {
    return this.stores[model.name];
  }
}
