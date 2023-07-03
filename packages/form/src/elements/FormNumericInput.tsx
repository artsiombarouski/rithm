import { FormItem } from '../components';
import { FormElementRenderProps } from '../types';
import { FormInputProps } from './FormInput';
import { IInputProps, Input, Text } from 'native-base';

type FormNumericInputType = Omit<FormInputProps, 'inputMode'>;

export const FormNumericInput = (props: FormNumericInputType) => {
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
        inputMode={'numeric'}
        size={'lg'}
        variant={'outline'}
        {...props}
        value={renderProps.field.value}
        onBlur={renderProps.field.onBlur}
        onChangeText={(value) => {
          const numericValue = value.replace(/[^0-9]/g, '');
          renderProps.field.onChange(trim ? numericValue.trim() : numericValue);
        }}
      />
    );
  };

  return <FormItem<IInputProps> {...restProps} render={renderInput} />;
};
