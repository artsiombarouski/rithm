import React from 'react';
import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Checkbox, ICheckboxProps } from 'native-base';
import { StyleSheet } from 'react-native';

export type CheckboxItemExtendedProps = Omit<ICheckboxProps, 'value'> & {
  reverse?: boolean;
  label?: string | React.ReactElement;
  checkedLabel?: string | React.ReactElement;
};

export type FormCheckboxProps<T extends FormValues = FormValues> =
  FormItemProps<T> & CheckboxItemExtendedProps;

export const FormCheckbox = (props: FormCheckboxProps) => {
  const renderCheckbox = (
    { reverse, label, checkedLabel, ...restProps }: CheckboxItemExtendedProps,
    { field }: FormElementRenderProps,
  ) => {
    const positionProps: Partial<ICheckboxProps> = {};
    if (reverse) {
      positionProps._stack = {
        ...restProps._stack,
        style: StyleSheet.flatten([
          {
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          },
          restProps._stack?.style,
        ]),
      };
      positionProps._text = {
        ...restProps._text,
        style: StyleSheet.flatten([
          {
            marginLeft: 0,
          },
          restProps._text?.style,
        ]),
      };
    }
    const currentLabel = field.value && checkedLabel ? checkedLabel : label;
    return (
      <Checkbox
        {...restProps}
        {...positionProps}
        value={field.name}
        isChecked={!!field.value}
        onChange={field.onChange}
      >
        {currentLabel}
      </Checkbox>
    );
  };

  return (
    <FormItem<CheckboxItemExtendedProps> {...props} render={renderCheckbox} />
  );
};
