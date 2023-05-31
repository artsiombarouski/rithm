import { useForm as useHookForm, UseFormProps } from 'react-hook-form';
import { FormInstance, FormValues } from '../types';

export function useForm<TFieldValues extends FormValues = FormValues>(
  props?: UseFormProps<TFieldValues>,
): FormInstance<TFieldValues> {
  return useHookForm(props);
}
