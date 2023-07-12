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
  theme?: AlertThemeType;
};

export type AlertThemeType = {
  [key: string]: {
    iconSource?: any;
    status?: string;
    colorScheme?: string;
  };
};
