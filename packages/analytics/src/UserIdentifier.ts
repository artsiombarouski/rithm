import { Analytics } from './Analytics';
import { UserIdentifyService } from './UserIdentify.service';
import { parseName } from './utils/NameParser';

export type InternalUserProperties = {
  name?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  internal_user_id?: any;
  last_login?: any;
  first_login?: any;
  phone?: string;
};

export class UserIdentifier {
  private static services: UserIdentifyService[] = [];
  private static cachedUserProperties: {
    [p: string]: any;
  } & InternalUserProperties = {};

  static registerService(...services: UserIdentifyService[]) {
    for (const service of services) {
      if (this.services.find((e) => e.name === service.name)) {
        continue;
      }
      this.services.push(service);
    }
  }

  static identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ): Promise<any> | void {
    return Promise.all(
      this.services.map((e) =>
        e.identifyUser(id, email).catch((error) => {
          console.error(`UserIdentifier identifyUser error (${e.name})`, error);
          Analytics.error(error);
        }),
      ),
    ).then(() => Promise.all(this.services.map((e) => e.afterUserIdentify())));
  }

  static onUserLogout() {
    Promise.all(
      this.services.map((e) =>
        e.onUserLogout().catch((error) => {
          console.error(`UserIdentifier user logout error (${e.name})`, error);
          Analytics.error(error);
        }),
      ),
    );
  }

  static async setEmail(email: string | undefined) {
    await Promise.all(
      this.services.map((e) =>
        e.setEmail(email).catch((error) => {
          console.error(`UserIdentifier set email error (${e.name})`, error);
          Analytics.error(error);
        }),
      ),
    );
  }

  static setUserProperties(
    params: { [p: string]: any } & InternalUserProperties,
  ): Promise<any> | void {
    const targetParams = { ...this.cachedUserProperties, ...params };
    trySplitNameFromParams(targetParams);
    this.cachedUserProperties = targetParams;
    return Promise.all(
      this.services.map((e) =>
        e.setUserProperties(targetParams).catch((error) => {
          console.error(
            `UserIdentifier set user properties error (${e.name})`,
            error,
          );
          Analytics.error(error);
        }),
      ),
    ).then(() =>
      Promise.all(this.services.map((e) => e.afterSetUserProperties())),
    );
  }

  static async collectUniqueIds(): Promise<{ [p: string]: string }> {
    const result = {};
    await Promise.all(
      this.services.map((e) =>
        e.collectUniqueIds().then((ids) => Object.assign(result, ids)),
      ),
    );
    return result;
  }
}

/*
Utils
 */

function trySplitNameFromParams(
  params: { [p: string]: any } & InternalUserProperties,
) {
  if (!params.name) {
    return;
  }
  try {
    const parsedName = parseName(params.name);
    if (parsedName) {
      if (!params.first_name && parsedName.firstName) {
        params.first_name = parsedName.firstName;
      }
      if (!params.last_name && parsedName.lastName) {
        params.last_name = parsedName.lastName;
      }
      if (!params.middle_name && parsedName.middleName) {
        params.middle_name = parsedName.middleName;
      }
    }
  } catch (ignore) {}
}
