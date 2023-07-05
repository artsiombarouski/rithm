import { isEmpty } from 'lodash';
import {
  AnalyticParams,
  AnalyticsInitiateCheckoutInfo,
  AnalyticsPurchaseInfo,
  AnalyticsSubscriptionInfo,
} from './types';
import { UserIdentifier } from './UserIdentifier';
import { AnalyticsService } from './Analytics.service';

export class Analytics {
  private static services: AnalyticsService[] = [];
  private static servicesSupportedEvents: AnalyticsService[] = [];
  private static servicesSupportedScreen: AnalyticsService[] = [];

  static registerServices(...services: AnalyticsService[]) {
    for (const service of services) {
      this.services.push(service);
      if (!(service.options && service.options.isEventsEnabled === false)) {
        this.servicesSupportedEvents.push(service);
      }
      if (!(service.options && service.options.isScreenEnabled === false)) {
        this.servicesSupportedScreen.push(service);
      }
    }
    UserIdentifier.registerService(...services);
  }

  static setAppTrackingAllowed(allowed: boolean) {
    Promise.all(this.services.map((e) => e.setAppTrackingAllowed(allowed)));
  }

  static event(name: string, ...params: AnalyticParams[]) {
    const targetParams = mergeParams(params);
    Promise.all(
      this.servicesSupportedEvents.map((e) =>
        e.event(name, targetParams).catch((error) => {
          console.error(`Analytics event track error (${e.name})`, error);
          this.error(error);
        }),
      ),
    );
  }

  static screen(name: string, params: AnalyticParams) {
    Promise.all(
      this.servicesSupportedScreen.map((e) =>
        e.screen(name, params).catch((error) => {
          console.error(`Analytics screen track error (${e.name})`, error);
          this.error(error);
        }),
      ),
    );
  }

  static subscription(info: AnalyticsSubscriptionInfo) {
    Promise.all(
      this.servicesSupportedScreen.map((e) =>
        e.subscription(info).catch((error) => {
          console.error(
            `Analytics subscription track error (${e.name})`,
            error,
          );
          this.error(error);
        }),
      ),
    );
  }

  static purchase(info: AnalyticsPurchaseInfo) {
    Promise.all(
      this.servicesSupportedScreen.map((e) =>
        e.purchase(info).catch((error) => {
          console.error(`Analytics purchase track error (${e.name})`, error);
          this.error(error);
        }),
      ),
    );
  }

  static initiateCheckout(info: AnalyticsInitiateCheckoutInfo) {
    Promise.all(
      this.servicesSupportedScreen.map((e) =>
        e.initiateCheckout(info).catch((error) => {
          console.error(
            `Analytics initiate checkout track error (${e.name})`,
            error,
          );
          this.error(error);
        }),
      ),
    );
  }

  static error(error: any) {
    Promise.all(
      this.services.map((e) =>
        e.error(error).catch((_) => {
          //HERE YOU FORMAT
          let description = 'Getting an issue, please try later!';
          if (typeof error === 'string') {
            description = error;
          }
          if (typeof error === 'object') {
            if (error?.[0]?.message) {
              description = error?.[0]?.message;
            }
            if (error?.message) {
              description = error?.message;
            }
            if (error?.response?.data?.message) {
              description = error?.response?.data?.message;
            }
          }
          let errorData = error;
          if (description) {
            errorData = new Error(description);
          }
          if (!(error && error.stack && error.message)) {
            errorData = new Error(JSON.stringify(error));
          }
          return Promise.all(
            this.services.map((e) =>
              e.error(errorData).catch((e) => {
                console.log(e);
              }),
            ),
          );
        }),
      ),
    ).catch((e) => {
      console.log(e);
    });
  }
}

function mergeParams(params?: AnalyticParams[]) {
  const result = {};
  params?.filter((e) => !isEmpty(e)).forEach((e) => Object.assign(result, e));
  return result;
}
