import { FormItem, TimePicker, TimePickerProps } from '../components';
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
    const value = renderProps.field.value
      ? new Date(renderProps.field.value)
      : new Date();
    return (
      <View style={[styles.container, containerStyle]}>
        <TimePicker
          {...restProps}
          value={{ hours: value.getHours(), minutes: value.getMinutes() }}
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
