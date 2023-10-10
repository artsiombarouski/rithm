import { AnalyticsServiceOptions } from '@artsiombarouski/rn-analytics';

export const kMixpanelId = 'mixpanelId';

export type MixpanelServiceOptions = AnalyticsServiceOptions & {
  projectToken: string;
  autoPageViewTracking?: boolean;
};
