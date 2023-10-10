import {
  AnalyticsService,
  InternalUserProperties,
} from '@artsiombarouski/rn-analytics';
import { BrevoServiceOptions } from './types';
import { Brevo } from './Brevo';

export class BrevoAnalyticsService extends AnalyticsService {
  private instance: Brevo;

  constructor(readonly options: BrevoServiceOptions) {
    super('brevo', options);
  }

  async init() {
    this.instance = new Brevo({
      clientKey: this.options.clientKey,
      environment: this.options.environment,
    });
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {
    if (!email) {
      return;
    }
    await this.instance.identify(email, {
      appUserId: id,
    });
  }

  async setUserProperties(
    params: { [p: string]: any } & InternalUserProperties,
  ): Promise<void> {
    const { first_name, last_name, ...restProps } = params;
    await this.instance.setUserProperties({
      firstname: first_name,
      lastname: last_name,
      ...restProps,
    });
  }

  async event(name: string, params: { [p: string]: any }): Promise<void> {
    await this.instance.trackEvent(name, params);
  }

  async screen(name: string, params: { [p: string]: any }): Promise<void> {
    await this.instance.trackPageView(name, params);
  }
}
