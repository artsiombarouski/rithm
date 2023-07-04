import { FormControl, IFormControlHelperTextProps } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ControllerRenderProps, FieldPath } from 'react-hook-form';
import { FormValues } from '../types';

export type FormHelperProps<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  helperText?: string | ((value: TFieldValues) => string);
  helperProps?: IFormControlHelperTextProps;
};

export const FormHelper = (props: FormHelperProps) => {
  const { field, helperText, ...restProps } = props || {};
  return (
    <FormControl.HelperText
      opacity={props?.helperText ? 1 : 0}
      _invalid={styles.invalid}
      {...restProps}
    >
      {typeof helperText === 'function'
        ? helperText(field.value)
        : helperText ?? 'Invisible text'}
    </FormControl.HelperText>
  );
};

const styles = StyleSheet.create({
  invalid: {
    display: 'none',
  },
});
