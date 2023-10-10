import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export type BrevoServiceOptions = AnalyticsServiceOptions & {
  clientKey: string;
  environment?: string;
};
