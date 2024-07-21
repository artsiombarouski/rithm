import { ServiceContainer, ServiceInfo } from '@artsiombarouski/rn-services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create as createHydrate } from 'mobx-persist';


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
