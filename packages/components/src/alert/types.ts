export enum AlertType {
  Error = 'error',
  Info = 'info',
  Success = 'success',
}

export type AlertContextFields = {
  title?: string;
  message?: string;
  action?: string;
  open?: boolean;
  alertType?: AlertType;
  placement?:
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right';
  duration?: number | null;
};

export type AlertContextType = {
  current?: AlertContextFields;
  dispatch: (props: AlertContextFields) => void;
  showInfo: (props: AlertContextFields) => void;
  showError: (props: AlertContextFields) => void;
  showSuccess: (props: AlertContextFields) => void;
  theme?: any; //todo
};

export type AlertThemeType = {
  [key: string]: {
    backgroundColor: string;
    borderColor: string;
    iconSource: any;
  };
};
