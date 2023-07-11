import {
  FormDropDownComponent,
  FormDropDownComponentProps,
  FormItem,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { ITextProps, Text } from 'native-base';
import { useMemo } from 'react';

export const DEFAULT_OPTION_KEY = 'all';
const DEFAULT_OPTION_LABEL = 'All';

export type FormDropDownProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<FormDropDownComponentProps, 'value' | 'onChange'> & {
      isRawText?: boolean;
      rawTextProps?: ITextProps;
      includeDefaultOption?: boolean;
      defaultOptionLabel?: string;
    };

export function FormDropDown<T extends FormValues = FormValues>(
  props: FormDropDownProps<T>,
) {
  const {
    isRawText = false,
    rawTextProps,
    options,
    includeDefaultOption = false,
    defaultOptionLabel = DEFAULT_OPTION_LABEL,
  } = props;

  const enhancedOptions = useMemo(() => {
    if (!options) return [];
    let enhancedOptions = [...options];

    if (includeDefaultOption) {
      enhancedOptions = [
        { key: DEFAULT_OPTION_KEY, label: defaultOptionLabel },
        ...enhancedOptions,
      ];
    }
    return enhancedOptions;
  }, [options, includeDefaultOption, defaultOptionLabel]);

  const renderElement = (
    props: FormDropDownComponentProps,
    { field }: FormElementRenderProps,
  ) => {
    if (isRawText) {
      const label =
        enhancedOptions?.find((option) => option.key === field.value)?.label ||
        '';
      return (
        <Text fontSize={16} {...rawTextProps}>
          {label}
        </Text>
      );
    }
    return (
      <FormDropDownComponent
        {...props}
        options={enhancedOptions}
        value={field.value}
        onChange={(item) => {
          field.onChange(item.key);
        }}
      />
    );
  };

  return <FormItem {...props} render={renderElement} />;
}
