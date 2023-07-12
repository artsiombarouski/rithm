import { useAlert } from './Alert';
import { CustomAlert } from './CustomAlert';
import { Toast } from 'native-base';
import React, { useEffect } from 'react';

export const AlertToast = () => {
  const { current, dispatch, theme } = useAlert();

  useEffect(() => {
    if (current?.open) {
      Toast.show({
        placement: current.placement ?? 'bottom-right',
        duration: current.duration ?? 3000,
        //todo: add possibility to pass custom component or render simple message
        render: () => (
          <CustomAlert
            mx={4}
            alertTheme={theme}
            title={current.title}
            message={current.message}
            type={current.alertType}
          />
        ),
        onCloseComplete: () => dispatch({ action: 'close' }),
      });
    }
  }, [current, dispatch, theme]);

  return null;
};
