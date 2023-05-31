import 'reflect-metadata';
import { OnServiceSetupCallback, ServiceInfo } from './types';
import { SERVICE_META_KEY } from './decorators';
import { BaseService } from './interfaces';

export class ServiceContainer {
  private _parent?: ServiceContainer;
  private _isInitialized: boolean = false;
  private services: { [key: string]: any } = {};

  constructor(
    private readonly options: {
      services: ServiceInfo[];
      serviceSetupCallbacks?: OnServiceSetupCallback[];
    },
  ) {}

  get parent() {
    return this._parent;
  }

  set parent(container: ServiceContainer | undefined) {
    this._parent = container;
  }

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  async init() {
    if (this._isInitialized) {
      return;
    }
    const loadedServices = await Promise.all(
      this.options.services.map(async (e) => {
        const service = await this.initializeService(e);
        const serviceName = Reflect.getMetadata(
          SERVICE_META_KEY,
          service.constructor,
        );
        this.services[serviceName] = service;
        return service;
      }),
    );

    await ServiceContainer.notifyLoaded(loadedServices);
    await ServiceContainer.notifyReady(loadedServices);
    this._isInitialized = true;
  }

  getService<T extends new (...args: any[]) => any>(clazz: T): InstanceType<T> {
    const serviceName = Reflect.getMetadata(SERVICE_META_KEY, clazz);
    const result = this.services[serviceName] ?? this.parent?.getService(clazz);
    if (!result) {
      throw new Error(`Service not found: ${clazz}`);
    }
    return result;
  }

  private async initializeService(info: ServiceInfo) {
    const result = await ServiceContainer.createService(info);
    await this.setupService(result);
    return result;
  }

  private async setupService(service: any) {
    (service as BaseService).getService = (clazz: any) =>
      this.getService(clazz);
    if (service.init) {
      await service.init();
    }
    if (this.options.serviceSetupCallbacks) {
      for (const callback of this.options.serviceSetupCallbacks) {
        await callback(service);
      }
    }
  }

  static async notifyLoaded(components: any[]) {
    for (const component of components) {
      if (component.onServicesLoaded) {
        await component.onServicesLoaded();
      }
    }
  }

  static async notifyReady(components: any[]) {
    for (const component of components) {
      if (component.onServicesReady) {
        await component.onServicesReady();
      }
    }
  }

  static async createService(info: ServiceInfo) {
    if (typeof info === 'function') {
      if (Object.getOwnPropertyDescriptor(info, 'prototype')?.writable) {
        return await info();
      }
      return new info();
    }
    return info;
  }
}
