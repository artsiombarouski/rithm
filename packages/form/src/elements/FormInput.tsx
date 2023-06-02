import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Input, IInputProps } from 'native-base';

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
        {...renderProps.field}
        style={[props.style]}
        variant={'outline'}
      />
    );
  };

  return <FormItem<IInputProps> {...props} render={renderInput} />;
};
