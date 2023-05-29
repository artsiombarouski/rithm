import { create as createHydrate } from 'mobx-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ServiceContainer, ServiceInfo } from '@rithm/rn-core';

const hydrate = createHydrate({
  storage: AsyncStorage,
});

export function withServicePersist(key: string, service: ServiceInfo) {
  return async () => {
    const result = await ServiceContainer.createService(service);
    hydrate(key, result);
    return result;
  };
}
