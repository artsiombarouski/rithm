import {
  BaseService,
  OnServicesLoaded,
  service,
} from '@artsiombarouski/rn-services';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';
import { UserPayload } from '../api/User.payload';
import { defaultResourceApiConfig } from '@artsiombarouski/rn-resources';
import { MovieDbConfig } from '../api/MovieDbConfig';

@service()
export class UserScopeService extends BaseService implements OnServicesLoaded {
  private _currentUserKey?: string;

  get currentUserKey() {
    return this._currentUserKey;
  }

  onServicesLoaded(): void | Promise<void> {
    const userService = this.getService(UserStoreService<UserPayload>);
    this._currentUserKey = userService.currentUser?.key;
    defaultResourceApiConfig.transport.interceptors.request.use((request) => {
      request.headers['Authorization'] = `Bearer ${MovieDbConfig.apiKey}`;
      return request;
    });
  }
}
