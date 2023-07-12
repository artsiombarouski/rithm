import { AppIcon } from '../AppIcon';
import { useAlert } from './Alert';
import { AlertThemeType } from './types';
import { isNothing } from '@artsiombarouski/rn-resources/src/utils';
import { Row, Text, Alert, Column, ITextProps, useTheme } from 'native-base';
import { IAlertProps } from 'native-base/src/components/composites/Alert/types';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

type AlertProps = Omit<IAlertProps, 'status'> & {
  title?: string | ReactNode;
  message?: string | ReactNode;
  iconProps?: any;
  titleProps?: ITextProps;
  messageProps?: ITextProps;
  type?: 'info' | 'error' | 'success' | string;
  showDefaultIcon?: boolean;
  alertTheme?: AlertThemeType;
};

export const CustomAlert = (props: AlertProps) => {
  const {
    title,
    message,
    type = 'info',
    showDefaultIcon = false,
    titleProps,
    messageProps,
    iconProps,
    alertTheme,
    ...restProps
  } = props || {};
  const theme = useTheme();

  const { colorScheme, status, iconSource } =
    (alertTheme ?? useAlert().theme)?.[type] || {};

  const color = colorScheme ?? status ?? type;

  return (
    <Alert
      variant={'outline'}
      bgColor={`${color}.50`}
      borderColor={`${color}.100`}
      status={status}
      {...restProps}
    >
      <Row space={4} alignItems="start" flex={1}>
        {!iconSource || showDefaultIcon ? (
          <Alert.Icon size={5} />
        ) : (
          <AppIcon
            style={styles.icon}
            source={iconSource}
            color={theme.colors[color]?.[900]}
            {...iconProps}
          />
        )}
        <Column space={1} flex={1}>
          {!isNothing(title) && (
            <Text
              fontSize="sm"
              fontWeight={'semibold'}
              color="blueGray.800"
              textAlign={'start'}
              {...titleProps}
            >
              {title}
            </Text>
          )}
          {!isNothing(message) && (
            <Text
              fontSize={'sm'}
              color={'blueGray.600'}
              textAlign={'start'}
              {...messageProps}
            >
              {message}
            </Text>
          )}
        </Column>
      </Row>
    </Alert>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});
