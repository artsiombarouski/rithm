import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { IInputProps, Input, ITextProps, Text } from 'native-base';

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    IInputProps & {
      trim?: boolean;
      isRawText?: boolean;
      rawTextProps?: ITextProps;
    };

export const FormInput = (props: FormInputProps) => {
  const { trim = false, isRawText = false, rawTextProps, ...restProps } = props;
  const renderInput = (
    props: IInputProps,
    renderProps: FormElementRenderProps,
  ) => {
    if (isRawText) {
      return (
        <Text fontSize={16} {...rawTextProps}>
          {renderProps.field.value}
        </Text>
      );
    }
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
