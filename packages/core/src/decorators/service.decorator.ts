import { injectable } from 'inversify';

export const SERVICE_META_KEY = 'rithm:service';

export function service(name?: string) {
  const injectionDecorator = injectable();
  return function (target: any) {
    Reflect.defineMetadata(SERVICE_META_KEY, name ?? target.name, target);
    injectionDecorator(target);
  };
}
