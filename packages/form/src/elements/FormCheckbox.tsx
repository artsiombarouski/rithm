import { FieldValues } from 'react-hook-form';
import { FormElementRenderProps, FormItemProps } from '../types';
import { Checkbox, CheckboxItemProps } from 'react-native-paper';
import { FormItem } from '../components';

export type FormCheckboxProps<T extends FieldValues = FieldValues> =
  FormItemProps<T> & Omit<CheckboxItemProps, 'status'>;

export const FormCheckbox = (props: FormCheckboxProps) => {
  const renderSwitch = (
    props: CheckboxItemProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <Checkbox.Item
        {...props}
        status={field.value === true ? 'checked' : 'unchecked'}
        onPress={() => {
          field.onChange(!field.value);
        }}
      />
    );
  };

  return <FormItem<CheckboxItemProps> {...props} render={renderSwitch} />;
};
