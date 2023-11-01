import { FirebaseAnalytics } from './FirebaseAnalytics';
import { initializeFirebaseAnalytics } from './initializeFirebaseAnalytics';
import { FirebaseServiceOptions, kFirebaseId } from './types';
import { AnalyticsService } from '@artsiombarouski/rn-analytics';
import {
  AnalyticsPurchaseInfo,
  AnalyticsSubscriptionInfo,
} from '@artsiombarouski/rn-analytics/src/types';

const Analytics = FirebaseAnalytics;

export class FirebaseAnalyticsService extends AnalyticsService {
  constructor(readonly options: FirebaseServiceOptions = {}) {
    super('firebase', options);
    initializeFirebaseAnalytics(options.config ?? {});
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {
    await Analytics.setUserId(id);
    await this.setEmail(email);
  }

  async setEmail(email: string | undefined) {
    if (email) {
      await Analytics.setUserProperty('email', email);
    }
  }

  async setUserProperties(params: { [p: string]: any }) {
    await Analytics.setUserProperties(this.transformParamsToStringOnly(params));
  }

  async event(name: string, params: { [p: string]: any }) {
    await Analytics.logEvent(name, params);
  }

  async screen(name: string, params: { [p: string]: any }) {
    // Note: firebase doesn't support custom parameters
    const targetParams = {
      screen_name: name,
    };
    await Analytics.logScreenView(targetParams);
  }

  async purchase(info: AnalyticsPurchaseInfo): Promise<void> {
    await Analytics.logPurchase({
      currency: info.currency ? info.currency : '',
      value: info.price ? parseInt(info.price.toString(), 10) : 0,
    });
  }

  async subscription(info: AnalyticsSubscriptionInfo) {
    await Analytics.logPurchase({
      currency: info.currency ? info.currency : '',
      value: info.price ? parseInt(info.price.toString(), 10) : 0,
    });
  }

  async collectUniqueIds(): Promise<{ [p: string]: string }> {
    const id = await Analytics.getAppInstanceId();
    return {
      [kFirebaseId]: id,
    };
  }
}
