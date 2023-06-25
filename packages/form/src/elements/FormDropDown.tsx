import {
  FormDropDownComponent,
  FormDropDownComponentProps,
  FormItem,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { ITextProps, Text } from 'native-base';

export type FormDropDownProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<FormDropDownComponentProps, 'value' | 'onChange'> & {
      isRawText?: boolean;
      rawTextProps?: ITextProps;
    };

export function FormDropDown<T extends FormValues = FormValues>(
  props: FormDropDownProps<T>,
) {
  const { isRawText = false, rawTextProps, options } = props;
  const renderElement = (
    props: FormDropDownComponentProps,
    { field }: FormElementRenderProps,
  ) => {
    if (isRawText) {
      const label =
        options?.find((option) => option.key === field.value)?.label || '';
      return (
        <Text fontSize={16} {...rawTextProps}>
          {label}
        </Text>
      );
    }
    return (
      <FormDropDownComponent
        {...props}
        value={field.value}
        onChange={(item) => {
          field.onChange(item.key);
        }}
      />
    );
  };

  return <FormItem {...props} render={renderElement} />;
}
