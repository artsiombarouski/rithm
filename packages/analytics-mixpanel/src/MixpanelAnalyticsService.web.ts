import {
  AnalyticsService,
  InternalUserProperties,
} from '@artsiombarouski/rn-analytics';
import { kMixpanelId, MixpanelServiceOptions } from './types';
import mixpanel from 'mixpanel-browser';

export class MixpanelAnalyticsService extends AnalyticsService {
  constructor(readonly options: MixpanelServiceOptions) {
    super('mixpanel', options);
  }

  async init() {
    new Promise((resolve) => {
      mixpanel.init(this.options.projectToken, {
        persistence: 'localStorage',
        track_pageview: this.options.autoPageViewTracking,
        loaded: resolve,
      });
    });
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {
    if (!id) {
      return;
    }
    mixpanel.reset();
    mixpanel.identify(id);
    await new Promise((resolve) => {
      mixpanel.people.set('$email', email, resolve);
    });
  }

  async setEmail(email: string | undefined): Promise<void> {
    await new Promise((resolve) => {
      mixpanel.people.set('$email', email, resolve);
    });
  }

  async setUserProperties(
    params: { [p: string]: any } & InternalUserProperties,
  ): Promise<void> {
    const { name, first_name, last_name, ...restParams } = params;
    await new Promise((resolve) => {
      mixpanel.people.set(
        {
          $name: name,
          $first_name: first_name,
          $last_name: last_name,
          ...restParams,
        },
        resolve,
      );
    });
  }

  async event(name: string, params: { [p: string]: any }): Promise<void> {
    await new Promise((resolve) => {
      mixpanel.track(name, params, resolve);
    });
  }

  async screen(name: string, params: { [p: string]: any }): Promise<void> {
    mixpanel.track_pageview({ page: name, ...params });
  }

  async collectUniqueIds(): Promise<{ [p: string]: string }> {
    const distinctId = mixpanel.get_distinct_id();
    return {
      [kMixpanelId]: distinctId,
    };
  }
}
