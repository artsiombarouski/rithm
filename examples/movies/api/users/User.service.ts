import { Resource } from '@rithm/rn-resources';
import { service } from '@rithm/rn-core';
import { UserModel } from './User.model';

@service()
export class UserService extends Resource<UserModel> {}
