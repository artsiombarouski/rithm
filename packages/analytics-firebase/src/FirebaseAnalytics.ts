import {
  IFirebaseAnalytics,
  PurchaseEventParameters,
  ScreenViewParameters,
} from './types';
import analytics from '@react-native-firebase/analytics';

const Analytics = analytics();

export const FirebaseAnalytics: IFirebaseAnalytics = {
  getAppInstanceId(): Promise<string | null> {
    return Analytics.getAppInstanceId();
  },
  setUserId(id: string | null): Promise<void> {
    return Analytics.setUserId(id);
  },
  setUserProperty(name: string, value: string | null): Promise<void> {
    return Analytics.setUserProperty(name, value);
  },
  setUserProperties(properties: { [p: string]: string | null }): Promise<void> {
    return Analytics.setUserProperties(properties);
  },
  logEvent(name: string, params?: { [p: string]: any }): Promise<void> {
    return Analytics.logEvent(name, params);
  },
  logScreenView(params: ScreenViewParameters): Promise<void> {
    return Analytics.logScreenView(params);
  },
  logPurchase(params: PurchaseEventParameters): Promise<void> {
    return Analytics.logPurchase(params);
  },
};
