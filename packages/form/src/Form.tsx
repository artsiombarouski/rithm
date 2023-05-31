import { PropsWithChildren } from 'react';
import { FormProvider } from 'react-hook-form';
import { FormInstance, FormValues } from './types';

export type FormProps<TFieldValues extends FormValues = FormValues> =
  PropsWithChildren & {
    form: FormInstance<TFieldValues>;
  };

export function Form<TFieldValues extends FormValues = FormValues>(
  props: FormProps<TFieldValues>,
) {
  const { form, children } = props;
  return <FormProvider {...form}>{children}</FormProvider>;
}
