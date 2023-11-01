export type AnalyticsSubscriptionInfo = {
  product_id: string;
  currency?: string;
  price?: number | string;
};

export type AnalyticsPurchaseInfo = {
  product_id: string;
  currency: string;
  price: number;
};

export type AnalyticsInitiateCheckoutInfo = {
  product_id: string;
};

export type AnalyticParams = { [p: string]: any } & {
  scope?: string;
  scope_secondary?: string;
};

export type InternalUserProperties = {
  name?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  internal_user_id?: any;
  last_login?: any;
  first_login?: any;
};
