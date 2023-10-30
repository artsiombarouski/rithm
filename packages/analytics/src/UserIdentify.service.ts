import { InternalUserProperties } from './UserIdentifier';

export class UserIdentifyService {
  constructor(readonly name: string) {}

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {}

  async afterUserIdentify() {}

  async onUserLogout() {}

  async setEmail(email: string | undefined) {}

  async setUserProperties(
    params: { [key: string]: any } & InternalUserProperties,
  ) {}

  async afterSetUserProperties() {}

  async collectUniqueIds(): Promise<{ [key: string]: string }> {
    return {};
  }
}
