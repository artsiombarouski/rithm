import {
  FieldValues,
  useForm as useHookForm,
  UseFormProps,
} from 'react-hook-form';
import { FormInstance } from '../types';

export function useForm<TFieldValues extends FieldValues = FieldValues>(
  props?: UseFormProps<TFieldValues>,
): FormInstance<TFieldValues> {
  return useHookForm(props);
}
