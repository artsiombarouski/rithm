import { FacebookPixelAnalyticsServiceOptions } from './types';
import { AnalyticsService } from '@artsiombarouski/rn-analytics';

export class FacebookPixelService extends AnalyticsService {
  constructor(readonly options: FacebookPixelAnalyticsServiceOptions) {
    super('facebook-pixel', options);
  }
}