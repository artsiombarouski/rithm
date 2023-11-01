import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export interface ScreenViewParameters {
  screen_name?: string;
  screen_class?: string;

  [key: string]: any;
}

export interface Item {
  item_brand?: string;
  item_id?: string;
  item_name?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id?: string;
  item_list_name?: string;
  item_location_id?: string;
  item_variant?: string;
  quantity?: number;
  price?: number;
}

export interface PurchaseEventParameters {
  affiliation?: string;
  coupon?: string;
  currency?: string;
  items?: Item[];
  shipping?: number;
  tax?: number;
  value?: number;
  transaction_id?: string;
}

export interface BeginCheckoutParams {
  currency?: string;
  value?: number;
  coupon?: string;
  items?: Item[];
}

export type IFirebaseAnalytics = {
  getAppInstanceId(): Promise<string | null>;
  setUserId(id: string | null): Promise<void>;
  setUserProperty(name: string, value: string | null): Promise<void>;
  setUserProperties(properties: {
    [key: string]: string | null;
  }): Promise<void>;
  logEvent(name: string, params?: { [key: string]: any }): Promise<void>;
  logScreenView(params: ScreenViewParameters): Promise<void>;
  logPurchase(params: PurchaseEventParameters): Promise<void>;
  logBeginCheckout(params: BeginCheckoutParams): Promise<void>;
};

export const kFirebaseId = 'firebaseId';

export type FirebaseServiceOptions = AnalyticsServiceOptions & {
  config?: { [key: string]: any };
};
