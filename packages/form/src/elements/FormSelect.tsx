import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { DropDown, DropDownProps, FormItem } from '../components';
import { Button } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

export type FormSelectProps<T extends FormValues = FormValues> =
  FormItemProps<T> & Omit<DropDownProps, 'anchor' | 'onSelect'>;

export function FormSelect<T extends FormValues = FormValues>(
  props: FormSelectProps,
) {
  const renderElement = (
    props: DropDownProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <View style={styles.container}>
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
      </View>
    );
  };
  return <FormItem {...props} render={renderElement} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
