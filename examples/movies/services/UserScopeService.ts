import {
  BaseService,
  OnServicesLoaded,
  service,
} from '@artsiombarouski/rn-services';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';
import { UserPayload } from '../api/User.payload';

@service()
export class UserScopeService extends BaseService implements OnServicesLoaded {
  private _currentUserKey?: string;

  get currentUserKey() {
    return this._currentUserKey;
  }

  onServicesLoaded(): void | Promise<void> {
    this._currentUserKey = this.getService(
      UserStoreService<UserPayload>,
    ).currentUser?.key;
  }
}
