export type AnalyticsSubscriptionInfo = {
  plan_type?: string;
  trial_start?: string;
  trial_expiration?: string;
  subscription_start_timestamp?: string;
  referring_expert: any;
  platform?: string;
  currency?: string;
  price?: any;
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
