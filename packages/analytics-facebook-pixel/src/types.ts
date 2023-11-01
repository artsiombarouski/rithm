import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export type FacebookPixelAnalyticsServiceOptions = AnalyticsServiceOptions & {
  pixelId?: string;
};