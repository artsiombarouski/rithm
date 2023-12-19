import { FormItem } from '../components';
import {
  CreatableSelect,
  CreatableSelectProps,
} from '../components/select/CreatableSelect';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormCreatableSelectProps<T extends FormValues = FormValues> =
  FormItemProps<T> & CreatableSelectProps & {};

export function FormCreatableSelect<T extends FormValues = FormValues>(
  props: FormCreatableSelectProps<T>,
) {
  const renderSelect = (
    props: CreatableSelectProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <CreatableSelect
        {...props}
        value={renderProps.field.value}
        onChange={renderProps.field.onChange}
      />
    );
  };
  return <FormItem {...props} render={renderSelect} />;
}
