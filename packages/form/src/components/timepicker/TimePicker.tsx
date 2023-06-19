import { getAmPm, getTime } from './utils';
import IonicIcon from '@expo/vector-icons/Ionicons';
import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
} & Omit<
  TimePickerModalProps,
  'hours' | 'minutes' | 'use24HourClock' | 'onConfirm' | 'onDismiss' | 'visible'
>;

export function TimePicker({ value, onChange, ...props }: TimePickerProps) {
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
      <Pressable onPress={() => setVisible(true)} style={[styles.button]}>
        <Text>{getTime(time.hours, time.minutes)}</Text>
        <View style={styles.iconContainer}>
          <Text>{getAmPm(time.hours)}</Text>
          <IonicIcon name={'chevron-down'} />
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CFD6DD',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
