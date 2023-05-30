import { FieldValues } from 'react-hook-form';
import { FormElementRenderProps, FormItemProps } from '../types';
import { DropDown, DropDownProps, FormItem } from '../components';
import { Button } from 'react-native-paper';

export type FormSelectProps<T extends FieldValues = FieldValues> =
  FormItemProps<T> & Omit<DropDownProps, 'anchor' | 'onSelect'>;

export function FormSelect<T extends FieldValues = FieldValues>(
  props: FormSelectProps,
) {
  const renderElement = (
    props: DropDownProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <DropDown
        {...props}
        value={field.value}
        anchor={(anchorProps) => {
          const currentOption = props.options?.find(
            (e) => e.key === field.value,
          );
          const title = currentOption?.label ?? 'Click to select something';
          return <Button {...anchorProps}>{title}</Button>;
        }}
        onSelect={(item) => {
          field.onChange(item.key);
        }}
      />
    );
  };
  return <FormItem {...props} render={renderElement} />;
}
