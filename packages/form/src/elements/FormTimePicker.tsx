import {
  FormItem,
  TimePicker,
  TimePickerProps,
  TimeValue,
} from '../components';
import { FormElementRenderProps, FormItemProps } from '../types';
import { FieldValues } from 'react-hook-form';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type TimePickerExtendedProps = Omit<
  TimePickerProps,
  'value' | 'onChange'
> & {
  containerStyle?: StyleProp<ViewStyle>;
};

export type FormTimePickerProps<T extends FieldValues = FieldValues> =
  FormItemProps<T> & TimePickerExtendedProps;

export const FormTimePicker = (props: FormTimePickerProps) => {
  const renderTimePicker = (
    props: TimePickerExtendedProps,
    renderProps: FormElementRenderProps,
  ) => {
    const { containerStyle, ...restProps } = props;
    let value: TimeValue;
    if (renderProps.field.value) {
      const parsed = renderProps.field.value.split(':');
      value = { hours: parsed[0], minutes: parsed[1] };
    } else {
      const date = new Date();
      value = { hours: date.getHours(), minutes: date.getMinutes() };
    }
    return (
      <View style={[styles.container, containerStyle]}>
        <TimePicker
          {...restProps}
          value={value}
          onChange={(value) => {
            renderProps.field.onChange(`${value.hours}:${value.minutes}`);
          }}
        />
      </View>
    );
  };

  return <FormItem<TimePickerProps> {...props} render={renderTimePicker} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});
