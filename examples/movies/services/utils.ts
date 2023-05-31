import { useUserService } from '@artsiombarouski/rn-user-store-service';
import { UserPayload } from '../api/User.payload';

export function useUsers() {
  return useUserService<UserPayload>();
}
