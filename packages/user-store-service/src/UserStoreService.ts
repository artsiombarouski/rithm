import { service } from '@artsiombarouski/rn-services';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';

@service()
export class UserStoreService<UserPayload extends { key: any }> {
  @observable
  @persist('object')
  currentUser?: UserPayload | undefined;

  @observable
  @persist('list')
  users: UserPayload[] = [];

  constructor() {
    makeObservable(this);
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
  }

  @action.bound
  async updateUser(user: UserPayload) {
    runInAction(() => {
      const existsUser = this.users.find((e) => e.key === user.key);
      if (existsUser) {
        Object.assign(existsUser, user);
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
  }

  @action.bound
  async logout(key: string | undefined = undefined) {
    runInAction(() => {
      this.users = this.users.filter(
        (user) => user.key !== (key ?? this.currentUser?.key),
      );
      this.currentUser =
        !this.users || this.users.length === 0 ? undefined : this.users[0];
    });
  }
}
