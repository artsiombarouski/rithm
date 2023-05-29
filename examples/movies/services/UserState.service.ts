import { service } from '@rithm/rn-core';
import { action, makeObservable, observable, runInAction, toJS } from 'mobx';
import { persist } from 'mobx-persist';

@service()
export class UserStateService<UserAuth, UserPayload> {
  @observable
  @persist('object')
  userAuth?: UserAuth | undefined;

  @observable
  @persist('object')
  userInfo?: UserPayload | undefined;

  constructor() {
    makeObservable(this);
  }

  @action.bound
  async setUserAuth(auth: UserAuth, info: UserPayload) {
    runInAction(() => {
      this.userAuth = auth;
      this.userInfo = info;
    });
  }

  @action.bound
  async setUserInfo(info: Partial<UserPayload>) {
    runInAction(() => {
      this.userInfo = { ...toJS(this.userInfo), ...info } as UserPayload;
    });
  }

  @action.bound
  async logout() {
    runInAction(() => {
      this.userAuth = undefined;
      this.userInfo = undefined;
    });
  }
}
