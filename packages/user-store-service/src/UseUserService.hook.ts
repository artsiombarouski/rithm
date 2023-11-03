import { useService } from '@artsiombarouski/rn-services';
import { UserStoreService } from './UserStoreService';

export function useUserService<UserPayload extends { key: any }>() {
  return useService(UserStoreService) as unknown as UserStoreService<UserPayload>;
}
