export const SERVICE_META_KEY = 'rithm:service';

export function service(name?: string) {
  return function (target: any) {
    Reflect.defineMetadata(SERVICE_META_KEY, name ?? target.name, target);
  };
}
