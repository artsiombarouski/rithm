import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { IInputProps, Input } from 'native-base';

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> & IInputProps;

export const FormInput = (props: FormInputProps) => {
  const renderInput = (
    props: IInputProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <Input
        {...props}
        onBlur={renderProps.field.onBlur}
        value={renderProps.field.value}
        onChangeText={renderProps.field.onChange}
        style={[props.style]}
        variant={'outline'}
      />
    );
  };

  return <FormItem<IInputProps> {...props} render={renderInput} />;
};
