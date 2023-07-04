import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { IInputProps, Input, ITextProps, Text } from 'native-base';

export type FormInputFormatter = (input?: string) => string;

export const NumericFormInputFormatter: FormInputFormatter = (
  input?: string,
) => {
  return input.replace(/[^0-9.,]/g, '');
};

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    IInputProps & {
      trim?: boolean;
      isRawText?: boolean;
      rawTextProps?: ITextProps;
      formatters?: FormInputFormatter[];
      maxChars?: number;
    };

export const FormInput = (props: FormInputProps) => {
  const {
    trim = false,
    isRawText = false,
    rawTextProps,
    formatters,
    maxChars,
    ...restProps
  } = props;
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
        value={renderProps.field.value?.toString()}
        onBlur={renderProps.field.onBlur}
        onChangeText={(value) => {
          let result = trim ? value.trim() : value;
          if (formatters) {
            for (const formatter of formatters) {
              result = formatter(result);
            }
          }
          if (maxChars) {
            result = result.substring(0, maxChars);
          }
          return renderProps.field.onChange(result);
        }}
      />
    );
  };

  return <FormItem<IInputProps> {...restProps} render={renderInput} />;
};
