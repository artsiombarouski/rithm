import { PropsWithChildren } from 'react';
import { FieldValues, FormProvider } from 'react-hook-form';
import { FormInstance } from './types';

export type FormProps<TFieldValues extends FieldValues = FieldValues> =
  PropsWithChildren & {
    form: FormInstance<TFieldValues>;
  };

export function Form<TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues>,
) {
  const { form, children } = props;
  return <FormProvider {...form}>{children}</FormProvider>;
}
