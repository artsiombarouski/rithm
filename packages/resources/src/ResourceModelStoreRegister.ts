import { ResourceModelStore } from './ResourceModelStore';
import { ResourceModel } from './ResourceModel';
import { MODEL_META_KEY } from './decorators';

export class ResourceModelStoreRegister {
  public static global = new ResourceModelStoreRegister();

  private stores: { [key: string]: ResourceModelStore<any> } = {};

  add<T extends ResourceModel>(
    model: new (...args: any[]) => any,
    store: ResourceModelStore<T>,
  ) {
    const modelName = Reflect.getMetadata(MODEL_META_KEY, model);
    if (!modelName) {
      throw new Error('Model class not decorated: ' + model.name);
    }
    this.stores[modelName] = store;
  }

  get<T extends ResourceModel>(
    model: new (...args: any[]) => any,
  ): ResourceModelStore<T> {
    const modelName = Reflect.getMetadata(MODEL_META_KEY, model);
    if (!modelName) {
      throw new Error('Model class not decorated: ' + model.name);
    }
    return this.stores[modelName];
  }
}
