import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export const kAmplitudeId = 'amplitudeId';

export type AmplitudeServiceOptions = AnalyticsServiceOptions & {
  apiKey: string;
};
