import {
  FormItem,
  FormListComponent,
  FormListComponentProps,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import React from 'react';

export type FormListProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = FormItemProps<TFormValues> &
  Omit<FormListComponentProps<TItem, TFormValues>, 'renderProps'>;

export function FormList<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
>(props: FormListProps<TItem, TFormValues>) {
  const { showHelper, showError, keepErrorSpace, helperText } = props;
  const renderList = (
    props: FormListComponentProps<TItem, TFormValues>,
    renderProps: FormElementRenderProps<TFormValues>,
  ) => {
    return (
      <FormListComponent
        {...props}
        renderProps={renderProps}
        {...{ showHelper, showError, keepErrorSpace, helperText }}
      />
    );
  };

  return (
    <FormItem<FormListComponentProps<TItem, TFormValues>>
      {...props}
      render={renderList as any}
      showHelper={false}
      showError={false}
    />
  );
}
