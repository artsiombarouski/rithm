import { Resource } from '@artsiombarouski/rn-resources';
import { service } from '@artsiombarouski/rn-services';
import { UserModel } from './User.model';

@service()
export class UserService extends Resource<UserModel> {}
