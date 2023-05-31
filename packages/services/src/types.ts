import { IHydrateResult } from 'mobx-persist';

export type ServiceBuilder<T = any> = (
  key: string,
  store: T,
  initialState?: any,
) => IHydrateResult<T>;

export type ServiceInfo<T = any> =
  | ((builder: ServiceBuilder<T>) => T | Promise<T>)
  | T;

export type OnServiceSetupCallback = (service: any) => Promise<void>;
