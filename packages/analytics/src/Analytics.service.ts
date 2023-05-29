import { UserIdentifyService } from './UserIdentify.service';
import {
  AnalyticsInitiateCheckoutInfo,
  AnalyticsPurchaseInfo,
  AnalyticsSubscriptionInfo,
} from './types';

export interface AnalyticsExtensionsOptions {
  isEventsEnabled?: boolean;
  isScreenEnabled?: boolean;
  isErrorEnabled?: boolean;
}

export class AnalyticsService extends UserIdentifyService {
  constructor(
    readonly name: string,
    readonly options: AnalyticsExtensionsOptions = {},
  ) {
    super(name);
  }

  async setAppTrackingAllowed(allowed: boolean) {}

  async event(name: string, params: { [key: string]: any }) {}

  async screen(name: string, params: { [key: string]: any }) {}

  async subscription(info: AnalyticsSubscriptionInfo) {}

  async purchase(info: AnalyticsPurchaseInfo) {}

  async initiateCheckout(info: AnalyticsInitiateCheckoutInfo) {}

  async error(error: any) {}

  transformParamsToStringOnly(params: { [p: string]: any }) {
    const formattedParams: { [key: string]: any } = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (typeof v == 'object') {
          formattedParams[k] = JSON.stringify(v);
        } else if (typeof v == 'string') {
          formattedParams[k] = v;
        } else if (v) {
          formattedParams[k] = v.toString();
        } else {
          formattedParams[k] = null;
        }
      });
    }
    return formattedParams;
  }

  /**
   * Not all analytics contains built in parameter for screen tracking, in that case we should send view_page event
   * with screen_name parameter in parameters
   *
   * @param name
   * @param params
   */
  screenNameToParams(name: string, params: { [key: string]: any }) {
    const result = {
      screen_name: name,
    };
    if (params) {
      Object.assign(result, this.transformParamsToStringOnly(params));
    }
    return result;
  }
}
