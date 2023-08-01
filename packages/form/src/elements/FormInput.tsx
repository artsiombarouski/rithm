import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { IInputProps, Input, ITextProps, Text } from 'native-base';
import numeral from 'numeral';
import { useEffect, useState } from 'react';
import { useInputAutoHeight } from '../utils';

export type FormInputFormatter = (input?: string) => string;

export const NumericFormInputFormatter: FormInputFormatter = (
  input?: string,
) => {
  return input.replace(/[^0-9.,]/g, '');
};

export const NoSpaceFormInputFormatter: FormInputFormatter = (
  input?: string,
) => {
  return input?.replace(/\s/g, '') || '';
};

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    IInputProps & {
      trim?: boolean;
      isRawText?: boolean;
      rawTextProps?: ITextProps;
      formatters?: FormInputFormatter[];
      maxChars?: number;
      multilineAutoHeight?: boolean;
    };

export const FormInput = (props: FormInputProps) => {
  const {
    trim = false,
    isRawText = false,
    rawTextProps,
    formatters,
    maxChars,
    multilineAutoHeight = true,
    ...restProps
  } = props;

  const isNumericFormattingApplied = formatters?.includes(
    NumericFormInputFormatter,
  );
  const [displayValue, setDisplayValue] = useState('');

  const renderInput = (
    props: IInputProps,
    renderProps: FormElementRenderProps,
  ) => {
    const autoHeightProps = useInputAutoHeight(props, multilineAutoHeight);
    useEffect(() => {
      if (isNumericFormattingApplied && renderProps.field.value) {
        setDisplayValue(renderProps.field.value);
      }
    }, []);

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
        {...autoHeightProps}
        value={
          isNumericFormattingApplied
            ? displayValue.toString()
            : renderProps.field.value?.toString()
        }
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
          if (isNumericFormattingApplied) {
            setDisplayValue(result);
            const formattedResult = numeral(result).value()?.toString();
            return renderProps.field.onChange(formattedResult);
          } else {
            return renderProps.field.onChange(result);
          }
        }}
      />
    );
  };

  return <FormItem<IInputProps> {...restProps} render={renderInput} />;
};
