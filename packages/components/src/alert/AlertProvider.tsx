import { AlertContext } from './Alert';
import { AlertToast } from './AlertToast';
import { GlobalAlert } from './GlobalAlert';
import {
  AlertContextFields,
  AlertThemeType,
  AlertType,
  ShowErrorFromParams,
} from './types';
import { ResourceApiError } from '@artsiombarouski/rn-resources';
import React, { useReducer } from 'react';
import { Keyboard } from 'react-native';

type AlertProviderProps = {
  children?: JSX.Element;
  theme?: AlertThemeType;
};

const initialState: AlertContextFields = {
  action: 'close',
  open: false,
  alertType: AlertType.Info,
};

function reducer(state: any, action: any): AlertContextFields {
  switch (action.action) {
    case 'close':
      return {
        ...initialState,
      };
    case 'open':
    default:
      Keyboard.dismiss();
      return {
        ...state,
        open: true,
        alertType: action.alertType,
        title: action.title,
        duration: action.duration,
        placement: action.placement,
        message: action.message,
      };
  }
}

/**
 * Wrapper to use in App.tsx providing the value to all children
 */
export function AlertProvider({ children, theme }: AlertProviderProps) {
  const [current, dispatch] = useReducer(reducer, initialState);
  const value = {
    current,
    theme,
    dispatch,
    showError: (props: AlertContextFields) =>
      dispatch({
        ...props,
        action: 'open',
        alertType: AlertType.Error,
      }),
    showErrorFrom: (props: ShowErrorFromParams) => {
      const error = ResourceApiError.fromApiResponse(props.error);
      dispatch({
        ...props,
        title: error.title,
        message: error.message as string,
        action: 'open',
        alertType: AlertType.Error,
      });
    },
    showInfo: (props: AlertContextFields) =>
      dispatch({
        ...props,
        action: 'open',
        alertType: AlertType.Info,
      }),
    showSuccess: (props: AlertContextFields) =>
      dispatch({
        ...props,
        action: 'open',
        alertType: AlertType.Success,
      }),
  };
  GlobalAlert.instance = value;
  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertToast />
    </AlertContext.Provider>
  );
}
