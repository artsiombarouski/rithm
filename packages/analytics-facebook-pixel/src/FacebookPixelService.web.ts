import { FacebookPixelAnalyticsServiceOptions } from './types';
import { AnalyticsService } from '@artsiombarouski/rn-analytics';
import {
  AnalyticsInitiateCheckoutInfo,
  AnalyticsPurchaseInfo,
  AnalyticsSubscriptionInfo,
} from '@artsiombarouski/rn-analytics/src/types';
import ReactPixel from 'react-facebook-pixel';

export class FacebookPixelService extends AnalyticsService {
  constructor(readonly options: FacebookPixelAnalyticsServiceOptions) {
    super('facebook-pixel', options);
  }

  async init(): Promise<void> {
    ReactPixel.init(this.options.pixelId, undefined, {
      debug: false,
      autoConfig: true,
    });
  }

  async event(name: string, params: { [p: string]: any }): Promise<void> {
    ReactPixel.trackCustom(name, params);
  }

  async screen(name: string, params: { [p: string]: any }): Promise<void> {
    ReactPixel.pageView();
  }

  async subscription(info: AnalyticsSubscriptionInfo): Promise<void> {
    ReactPixel.track('Purchase', {
      content_ids: [info.product_id],
      content_type: 'product',
      value: info.price,
      currency: info.currency,
    });
  }

  async purchase(info: AnalyticsPurchaseInfo): Promise<void> {
    ReactPixel.track('Purchase', {
      content_ids: [info.product_id],
      content_type: 'product',
      value: info.price,
      currency: info.currency,
    });
  }

  async initiateCheckout(info: AnalyticsInitiateCheckoutInfo): Promise<void> {
    ReactPixel.track('InitiateCheckout', {
      content_ids: [info.product_id],
    });
  }
}