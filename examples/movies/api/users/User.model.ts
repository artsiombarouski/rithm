import { model, ResourceModel } from '@artsiombarouski/rn-resources';

@model()
export class UserModel extends ResourceModel {
  get name() {
    return this.get('name');
  }
}
