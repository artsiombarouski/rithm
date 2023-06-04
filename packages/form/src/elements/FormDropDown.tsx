import {
  FormDropDownComponent,
  FormDropDownComponentProps,
  FormItem,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormDropDownProps<T extends FormValues = FormValues> =
  FormItemProps<T> & Omit<FormDropDownComponentProps, 'value' | 'onChange'>;

export function FormDropDown<T extends FormValues = FormValues>(
  props: FormDropDownProps<T>,
) {
  const renderElement = (
    props: FormDropDownComponentProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <FormDropDownComponent
        {...props}
        value={field.value}
        onChange={(item) => {
          field.onChange(item.key);
        }}
      />
    );
  };

  return <FormItem {...props} render={renderElement} />;
}
