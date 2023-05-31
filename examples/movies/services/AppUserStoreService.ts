import { UserStoreService } from './UserStoreService';
import { service } from '@artsiombarouski/rn-core';

export type UserPayload = {
  key: string;
  info: {
    email: string;
  };
};

@service()
export class AppUserStoreService extends UserStoreService<UserPayload> {}
