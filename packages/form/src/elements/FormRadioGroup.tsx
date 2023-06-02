import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Radio, Text, IRadioGroupProps, IRadioProps } from 'native-base';

export type RadioButtonOption = {
  key: any;
  label?: string;
};

export type FormRadioGroupProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<IRadioGroupProps, 'onChange' | 'value' | 'children'> & {
      options: RadioButtonOption[];
      itemProps?: Omit<IRadioProps, 'value' | 'key'>;
    };

export function FormRadioGroup(props: FormRadioGroupProps) {
  const { options, itemProps, ...restProps } = props;
  const renderRadioGroup = (
    props: IRadioGroupProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <Radio.Group
        {...props}
        name={field.name}
        onChange={field.onChange}
        value={field.value}
      >
        {options.map((option) => {
          return (
            <Radio my={1} {...itemProps} value={option.key} key={option.key}>
              <Text>{option.label ?? option.key}</Text>
            </Radio>
          );
        })}
      </Radio.Group>
    );
  };
  return (
    <FormItem<IRadioGroupProps> {...restProps} render={renderRadioGroup} />
  );
}
