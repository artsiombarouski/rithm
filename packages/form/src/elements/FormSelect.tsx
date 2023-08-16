import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Select, SelectProps } from '../components/select';
import { FormItem } from '../components';

export type FormSelectProps<T extends FormValues = FormValues> =
  FormItemProps<T> & SelectProps & {};

export function FormSelect<T extends FormValues = FormValues>(
  props: FormSelectProps<T>,
) {
  const renderSelect = (
    props: SelectProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <Select
        {...props}
        value={renderProps.field.value}
        onChange={renderProps.field.onChange}
      />
    );
  };
  return <FormItem {...props} render={renderSelect} />;
}
