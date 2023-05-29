import { useContext } from 'react';
import { ServiceContext } from '../ServiceContainerBootstrap';

export function useService<T extends new (...args: any[]) => any>(
  clazz: T,
): InstanceType<T> {
  return useContext(ServiceContext).serviceContainer.getService(clazz);
}
