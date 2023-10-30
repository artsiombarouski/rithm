import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export type CleverTapAnalyticsServiceOptions = AnalyticsServiceOptions & {
  accountId: string;
  domain?: string;
  region?: 'sg1' | 'in1' | 'us1' | 'aps3' | 'mec1';
};

export const kCleverTapId = 'cleverTapId';
