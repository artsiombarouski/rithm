import amplitude, { AmplitudeClient } from 'amplitude-js';
import { AnalyticsService } from '@artsiombarouski/rn-analytics';
import { AmplitudeServiceOptions, kAmplitudeId } from './types';
import VersionCheck from 'react-native-version-check';

export class AmplitudeAnalyticsService extends AnalyticsService {
  private instance: AmplitudeClient;
  private userProperties: { [key: string]: any } = {};

  constructor(readonly options: AmplitudeServiceOptions) {
    super('amplitude', options);
  }

  async init() {
    const instance = amplitude.getInstance();
    await instance.init(this.options.apiKey);
    await instance.enableTracking();
    try {
      const appVersion = await VersionCheck.getCurrentVersion();
      await instance.setVersionName(appVersion);
    } catch (ignore: any) {}
    this.instance = instance;
  }

  async identifyUser(
    id: string | undefined,
    email: string | undefined = undefined,
  ) {
    await this.instance.setUserId(id);
    await this.setEmail(email);
  }

  async setEmail(value: string | undefined) {
    await this.setUserProperties({
      email: value,
    });
  }

  async setUserProperties(params: { [p: string]: any }) {
    Object.assign(this.userProperties, params);
    await this.instance.setUserProperties({ ...this.userProperties });
  }

  async event(name: string, params: { [p: string]: any }) {
    await this.instance.logEvent(name, params);
  }

  async screen(name: string, params: { [p: string]: any }) {
    await this.instance.logEvent(
      `view_page`,
      this.screenNameToParams(name, params),
    );
  }

  async collectUniqueIds(): Promise<{ [p: string]: string }> {
    const deviceId = this.instance.getDeviceId();
    return {
      [kAmplitudeId]: deviceId,
    };
  }
}
