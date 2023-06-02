import { create as createHydrate } from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceInfo } from '../types';
import { ServiceContainer } from '../ServiceContainer';

const hydrate = createHydrate({
  storage: AsyncStorage,
});

export function withServicePersist(key: string, service: ServiceInfo) {
  return async () => {
    const result = await ServiceContainer.createService(service);
    await hydrate(key, result);
    return result;
  };
}
