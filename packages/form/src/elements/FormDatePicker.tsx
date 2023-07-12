import { DatePicker, DatePickerProps, FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import React from 'react';

export type FormDatePickerProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<DatePickerProps, 'value' | 'onChange'> & {
      assignValues?: boolean;
    };

export const FormDatePicker = (props: FormDatePickerProps) => {
  const { assignValues, ...restProps } = props;

  const renderDatePicker = (
    props: DatePickerProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <DatePicker
        {...props}
        value={renderProps.field.value}
        onChange={(value) => {
          let targetValue;
          if (assignValues) {
            targetValue = { ...renderProps.field.value, ...value };
          } else {
            targetValue = value;
          }
          renderProps.field.onChange(targetValue);
        }}
      />
    );
  };

  return <FormItem<DatePickerProps> {...restProps} render={renderDatePicker} />;
};