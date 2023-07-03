import { FormControl, IFormControlHelperTextProps } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

export type FormHelperProps = {
  helperText?: string;
  helperProps?: IFormControlHelperTextProps;
};

export const FormHelper = (props: FormHelperProps) => {
  const { helperText, ...restProps } = props || {};
  return (
    <FormControl.HelperText
      opacity={props?.helperText ? 1 : 0}
      _invalid={styles.invalid}
      {...restProps}
    >
      {helperText ?? 'Invisible text'}
    </FormControl.HelperText>
  );
};

const styles = StyleSheet.create({
  invalid: {
    display: 'none',
  },
});
