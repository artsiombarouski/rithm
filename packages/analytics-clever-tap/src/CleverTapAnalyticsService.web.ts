import { CleverTapAnalyticsServiceOptions, kCleverTapId } from './types';
import {
  AnalyticsService,
  InternalUserProperties,
} from '@artsiombarouski/rn-analytics';
import clevertap from 'clevertap-web-sdk';

export class CleverTapAnalyticsService extends AnalyticsService {
  private currentSiteParams: { [key: string]: any } = {};

  constructor(readonly options: CleverTapAnalyticsServiceOptions) {
    super('clevertap', options);
  }

  async init() {
    clevertap.init(
      this.options.accountId,
      this.options.region,
      this.options.domain,
    );
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ): Promise<void> {
    if (id) {
      this.currentSiteParams.Identity = id;
    }
    if (email) {
      this.currentSiteParams.Email = email;
    }
    clevertap.onUserLogin.push({
      Site: this.currentSiteParams,
    });
  }

  async onUserLogout(): Promise<void> {
    this.currentSiteParams = {
      Email: this.currentSiteParams.Email,
      Identity: this.currentSiteParams.Identity,
    };
  }

  async setUserProperties(
    params: { [p: string]: any } & InternalUserProperties,
  ): Promise<void> {
    const { name, first_name, last_name, phone, ...restParams } = params;
    if (name) {
      this.currentSiteParams['Name'] = name;
    } else if (first_name || last_name) {
      this.currentSiteParams['Name'] = `${first_name} ${last_name}`.trim();
    }
    if (phone) {
      this.currentSiteParams['Phone'] = phone;
    }
    Object.assign(this.currentSiteParams, restParams);
    clevertap.onUserLogin.push({
      Site: this.currentSiteParams,
    });
  }

  async event(name: string, params: { [p: string]: any }): Promise<void> {
    clevertap.event.push(name, params);
  }

  async screen(name: string, params: { [p: string]: any }): Promise<void> {
    clevertap.event.push('viewPage', params);
  }

  async collectUniqueIds(): Promise<{ [p: string]: string }> {
    return {
      [kCleverTapId]: clevertap.getCleverTapID(),
    };
  }
}
