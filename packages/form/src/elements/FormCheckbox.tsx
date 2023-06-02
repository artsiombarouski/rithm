import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Checkbox, ICheckboxProps } from 'native-base';

export type CheckboxItemExtendedProps = Omit<ICheckboxProps, 'value'>;

export type FormCheckboxProps<T extends FormValues = FormValues> =
  FormItemProps<T> & CheckboxItemExtendedProps;

export const FormCheckbox = (props: FormCheckboxProps) => {
  const renderCheckbox = (
    props: CheckboxItemExtendedProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <Checkbox
        {...props}
        isChecked={!!field.value}
        value={field.name}
        onChange={field.onChange}
      />
    );
  };

  return (
    <FormItem<CheckboxItemExtendedProps> {...props} render={renderCheckbox} />
  );
};
