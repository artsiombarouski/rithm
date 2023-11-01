import { MixpanelServiceOptions } from './types';
import {
  AnalyticsService,
  InternalUserProperties,
} from '@artsiombarouski/rn-analytics';
import {
  AnalyticsInitiateCheckoutInfo,
  AnalyticsPurchaseInfo,
  AnalyticsSubscriptionInfo,
} from '@artsiombarouski/rn-analytics/src/types';
import { Mixpanel } from 'mixpanel-react-native';

export class MixpanelAnalyticsService extends AnalyticsService {
  private instance: Mixpanel;

  constructor(readonly options: MixpanelServiceOptions) {
    super('mixpanel', options);
  }

  async init() {
    this.instance = new Mixpanel(this.options.projectToken, true);
    await this.instance.init();
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {
    if (!id) {
      return;
    }
    await this.instance.reset();
    await this.instance.identify(id);
    await this.instance.getPeople().set({ $email: email });
  }

  async setEmail(email: string | undefined): Promise<void> {
    await this.instance.getPeople().set({ $email: email });
  }

  async setUserProperties(
    params: { [p: string]: any } & InternalUserProperties,
  ): Promise<void> {
    const { name, first_name, last_name, ...restParams } = params;
    this.instance.getPeople().set({
      $name: name,
      $first_name: first_name,
      $last_name: last_name,
      ...restParams,
    });
  }

  async event(name: string, params: { [p: string]: any }): Promise<void> {
    await this.instance.track(name, params);
  }

  async screen(name: string, params: { [p: string]: any }): Promise<void> {
    await this.instance.track('page_view', params);
  }

  async initiateCheckout(info: AnalyticsInitiateCheckoutInfo): Promise<void> {
    await this.instance.track('initiateCheckout', {
      productId: info.product_id,
    });
  }

  async subscription(info: AnalyticsSubscriptionInfo): Promise<void> {
    await this.instance.track('purchase', {
      productId: info.product_id,
      currency: info.currency ? info.currency : '',
      price: info.price ? parseInt(info.price.toString(), 10) : 0,
      isSubscription: true,
    });
  }

  async purchase(info: AnalyticsPurchaseInfo): Promise<void> {
    await this.instance.track('purchase', {
      productId: info.product_id,
      currency: info.currency ? info.currency : '',
      price: info.price ? parseInt(info.price.toString(), 10) : 0,
    });
  }
}