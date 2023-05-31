import {
  BaseService,
  OnServicesLoaded,
  service,
} from '@artsiombarouski/rn-core';
import { AppUserStoreService } from './AppUserStoreService';

@service()
export class UserScopeService extends BaseService implements OnServicesLoaded {
  private _currentUserKey?: string;

  get currentUserKey() {
    return this._currentUserKey;
  }

  onServicesLoaded(): void | Promise<void> {
    this._currentUserKey =
      this.getService(AppUserStoreService).currentUser?.key;
  }
}
