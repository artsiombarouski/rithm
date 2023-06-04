import { DropDown, DropDownProps, FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormSelectProps<T extends FormValues = FormValues> =
  FormItemProps<T> & Omit<DropDownProps, 'value' | 'onSelect'>;

export function FormSelect<T extends FormValues = FormValues>(
  props: FormSelectProps,
) {
  const renderElement = (
    props: DropDownProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <DropDown
        {...props}
        value={field.value}
        onSelect={(item) => {
          field.onChange(item.key);
        }}
      />
    );
  };

  return <FormItem {...props} render={renderElement} />;
}
