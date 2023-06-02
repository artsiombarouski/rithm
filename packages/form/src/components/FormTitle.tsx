import { FormControl } from 'native-base';
import React from 'react';

export type FormTitleProps = {
  title?: string;
};

export const FormTitle = (props: FormTitleProps) => {
  return <FormControl.Label>{props?.title}</FormControl.Label>;
};
