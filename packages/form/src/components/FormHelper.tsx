import { FormControl } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

export type FormHelperProps = {
  helperText?: string;
};

export const FormHelper = (props: FormHelperProps) => {
  return (
    <FormControl.HelperText
      opacity={props?.helperText ? 1 : 0}
      _invalid={styles.invalid}
      mt={1}
    >
      {props?.helperText ?? 'Invisible text'}
    </FormControl.HelperText>
  );
};

const styles = StyleSheet.create({
  invalid: {
    display: 'none',
  },
});
