import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { IInputProps, Input } from 'native-base';

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    IInputProps & {
      trim?: boolean;
    };

export const FormInput = (props: FormInputProps) => {
  const { trim = false, ...restProps } = props;
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
        onChangeText={(value) =>
          renderProps.field.onChange(trim ? value.trim() : value)
        }
      />
    );
  };

  return <FormItem<IInputProps> {...restProps} render={renderInput} />;
};
