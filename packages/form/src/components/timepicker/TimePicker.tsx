import { getAmPm, getTime } from './utils';
import { useTheme, Text, ChevronDownIcon } from 'native-base';
import React, { useCallback, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';

export type TimeValue = {
  hours: number;
  minutes: number;
};

type TimePickerModalProps = {
  locale?: undefined | string;
  label?: string;
  uppercase?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  hours?: number | undefined;
  minutes?: number | undefined;
  visible: boolean | undefined;
  onDismiss: () => any;
  onConfirm: (hoursAndMinutes: { hours: number; minutes: number }) => any;
  animationType?: 'slide' | 'fade' | 'none';
  keyboardIcon?: string;
  clockIcon?: string;
  use24HourClock?: boolean;
  inputFontSize?: number;
};

export type TimePickerProps = {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  buttonStyle?: StyleProp<ViewStyle>;
} & Omit<
  TimePickerModalProps,
  'hours' | 'minutes' | 'use24HourClock' | 'onConfirm' | 'onDismiss' | 'visible'
>;

export function TimePicker({
  value,
  onChange,
  buttonStyle,
  ...props
}: TimePickerProps) {
  const theme = useTheme();
  const [borderColor, setBorderColor] = useState(theme.colors.muted[300]);
  const [time, setTime] = useState(
    value ?? { hours: new Date().getHours(), minutes: new Date().getMinutes() },
  );

  const [visible, setVisible] = useState(false);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: TimeValue) => {
      onDismiss();
      setTime({ hours, minutes });
      onChange?.({ hours, minutes });
    },
    [onDismiss, onChange],
  );

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        onHoverIn={() => setBorderColor(theme.colors.primary[600])}
        onHoverOut={() => setBorderColor(theme.colors.muted[300])}
        style={[styles.button, buttonStyle, { borderColor }]}
      >
        <Text color={'blueGray.700'}>{getTime(time.hours, time.minutes)}</Text>
        <View style={styles.iconContainer}>
          <Text color={'blueGray.700'}>{getAmPm(time.hours)}</Text>
          <ChevronDownIcon size={4} p={1} ml={'2px'} />
        </View>
      </Pressable>
      <TimePickerModal
        {...props}
        visible={visible}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        hours={time.hours}
        minutes={time.minutes}
        use24HourClock={false} //todo: change component when passing as prop
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
