import React from 'react';
import {
  FormItem,
  FormListComponent,
  FormListComponentProps,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormListProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = FormItemProps<TFormValues> &
  Omit<FormListComponentProps<TItem, TFormValues>, 'renderProps'>;

export function FormList<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
>(props: FormListProps<TItem, TFormValues>) {
  const renderList = (
    props: FormListComponentProps<TItem, TFormValues>,
    renderProps: FormElementRenderProps<TFormValues>,
  ) => {
    return <FormListComponent {...props} renderProps={renderProps} />;
  };

  return (
    <FormItem<FormListComponentProps<TItem, TFormValues>>
      {...props}
      render={renderList as any}
    />
  );
}
