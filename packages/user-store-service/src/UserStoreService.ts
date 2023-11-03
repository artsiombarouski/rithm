import { OnServicesReady, service } from '@artsiombarouski/rn-services';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import _ from 'lodash';
import { DeepPartial } from './DeepPartial';

export interface UserStoreServiceOptions<UserPayload> {
  callbacks?: {
    onCurrentUserChanged?: (user?: UserPayload) => Promise<void> | void;
  };
}

@service()
export class UserStoreService<UserPayload extends { key: any }> implements OnServicesReady {
  @observable
  @persist('object')
  currentUser?: UserPayload | undefined | null;

  @observable
  @persist('list')
  users: UserPayload[] = [];

  constructor(readonly options?: UserStoreServiceOptions<UserPayload>) {
    makeObservable(this);
  }

  async onServicesReady() {
    await this.onCurrentUserChanged(this.currentUser);
  }

  @action.bound
  async addUser(user: UserPayload) {
    runInAction(() => {
      const existsUser = this.users.find((e) => e.key === user.key);
      if (!existsUser) {
        this.users = [...this.users, user];
      } else {
        Object.assign(existsUser, user);
      }
      this.currentUser = user;
    });
    await this.onCurrentUserChanged(this.currentUser);
  }

  @action.bound
  async updateUser(user: Partial<UserPayload>) {
    runInAction(() => {
      const existsUser = this.users.find((e) => e.key === user.key);
      if (existsUser) {
        Object.assign(existsUser, user);
      }
      if (this.currentUser.key === user.key) {
        Object.assign(this.currentUser, user);
      }
    });
  }

  @action.bound
  async updateUserProperty(key: string, user: DeepPartial<UserPayload>) {
    runInAction(() => {
      const existsUser = this.users.find((e) => e.key === key);
      if (existsUser) {
        _.merge(existsUser, user);
      }
      if (this.currentUser.key === key) {
        _.merge(this.currentUser, user);
      }
    });
  }

  @action.bound
  async setCurrentUser(userKey: any) {
    runInAction(() => {
      const targetUser = this.users.find((e) => e.key === userKey);
      if (targetUser) {
        this.currentUser = targetUser;
      }
    });
    await this.onCurrentUserChanged(this.currentUser);
  }

  @action.bound
  async logout(key: string | undefined = undefined) {
    runInAction(() => {
      this.users = this.users.filter(
        (user) => user.key !== (key ?? this.currentUser?.key),
      );
      this.currentUser =
        !this.users || this.users.length === 0 ? null : this.users[0];
    });
    await this.onCurrentUserChanged(this.currentUser);
  }

  protected async onCurrentUserChanged(user: UserPayload): Promise<void> {
    await this.options?.callbacks?.onCurrentUserChanged?.(user);
  }
}
