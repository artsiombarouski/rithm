import {
  AlertContextFields,
  AlertContextType,
  ShowErrorFromParams,
} from './types';

export class GlobalAlert {
  static instance: AlertContextType;

  static showInfo(params: AlertContextFields) {
    this.instance?.showInfo(params);
  }

  static showSuccess(params: AlertContextFields) {
    this.instance?.showSuccess(params);
  }

  static showError(params: AlertContextFields) {
    this.instance?.showError(params);
  }

  static showErrorFrom(params: ShowErrorFromParams) {
    this.instance?.showErrorFrom(params);
  }
}
