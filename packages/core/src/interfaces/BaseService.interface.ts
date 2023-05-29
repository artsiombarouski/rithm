export class BaseService {
  getService<T extends new (...args: any[]) => any>(clazz: T): InstanceType<T>{
    return Object as any;
  }
}
