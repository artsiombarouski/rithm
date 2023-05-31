import { UserStoreService } from './UserStoreService';
import { service } from '../../../packages/services';

export type UserPayload = {
  key: string;
  info: {
    email: string;
  };
};

@service()
export class AppUserStoreService extends UserStoreService<UserPayload> {}
