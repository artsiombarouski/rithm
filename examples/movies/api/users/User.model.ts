import { ResourceModel } from '@artsiombarouski/rn-resources';

export class UserModel extends ResourceModel {
  get name() {
    return this.get('name');
  }
}
