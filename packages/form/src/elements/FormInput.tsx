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
        size={'lg'}
        variant={'outline'}
        {...props}
        value={renderProps.field.value}
        onBlur={renderProps.field.onBlur}
        onChangeText={renderProps.field.onChange}
      />
    );
  };

  return <FormItem<IInputProps> {...props} render={renderInput} />;
};
