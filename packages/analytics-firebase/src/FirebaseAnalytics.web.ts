import {
  BeginCheckoutParams,
  IFirebaseAnalytics,
  PurchaseEventParameters,
  ScreenViewParameters,
} from './types';
import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from 'firebase/analytics';
import { getId, getInstallations } from 'firebase/installations';

export const FirebaseAnalytics: IFirebaseAnalytics = {
  async getAppInstanceId(): Promise<string | null> {
    return getId(getInstallations());
  },
  async setUserId(id: string | null): Promise<void> {
    return setUserId(getAnalytics(), id);
  },
  async setUserProperty(name: string, value: string | null): Promise<void> {
    return setUserProperties(getAnalytics(), { [name]: value });
  },
  async setUserProperties(properties: {
    [p: string]: string | null;
  }): Promise<void> {
    return setUserProperties(getAnalytics(), properties);
  },
  async logEvent(name: string, params?: { [p: string]: any }): Promise<void> {
    return logEvent(getAnalytics(), name, params);
  },
  async logScreenView(params: ScreenViewParameters): Promise<void> {
    return logEvent(getAnalytics(), 'screen_view', {
      firebase_screen: params.screen_name,
      firebase_screen_class: params.screen_class,
    });
  },
  async logPurchase(params: PurchaseEventParameters): Promise<void> {
    return logEvent(getAnalytics(), 'purchase', params as any);
  },
  async logBeginCheckout(params: BeginCheckoutParams): Promise<void> {
    return logEvent(getAnalytics(), 'begin_checkout', params as any);
  },
};