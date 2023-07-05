import {
  BaseService,
  OnServicesLoaded,
  service,
} from '@artsiombarouski/rn-services';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';
import { UserPayload } from '../api/User.payload';
import { defaultResourceApiConfig } from '@artsiombarouski/rn-resources';
import { MovieDbConfig } from '../api/MovieDbConfig';
import { UserIdentifier } from '@artsiombarouski/rn-analytics';

@service()
export class UserScopeService extends BaseService implements OnServicesLoaded {
  private _currentUserKey?: string;

  get currentUserKey() {
    return this._currentUserKey;
  }

  async onServicesLoaded() {
    const userService = this.getService(UserStoreService<UserPayload>);
    const currentUser = userService.currentUser;
    this._currentUserKey = currentUser?.key;
    defaultResourceApiConfig.transport.interceptors.request.use((request) => {
      request.headers['Authorization'] = `Bearer ${MovieDbConfig.apiKey}`;
      return request;
    });
    if (currentUser) {
      await UserIdentifier.identifyUser(
        currentUser.key,
        currentUser.info.email,
      );
    }
  }
}
