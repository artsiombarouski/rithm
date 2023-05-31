import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Checkbox, CheckboxItemProps } from 'react-native-paper';
import { FormItem } from '../components';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export type CheckboxItemExtendedProps = Omit<CheckboxItemProps, 'status'> & {
  containerStyle?: StyleProp<ViewStyle>;
};

export type FormCheckboxProps<T extends FormValues = FormValues> =
  FormItemProps<T> & CheckboxItemExtendedProps;

export const FormCheckbox = (props: FormCheckboxProps) => {
  const renderSwitch = (
    props: CheckboxItemExtendedProps,
    { field }: FormElementRenderProps,
  ) => {
    const { containerStyle, ...restProps } = props;
    return (
      <View style={[styles.container, containerStyle]}>
        <Checkbox.Item
          {...restProps}
          style={StyleSheet.flatten([styles.item, restProps.style])}
          status={field.value === true ? 'checked' : 'unchecked'}
          onPress={() => {
            field.onChange(!field.value);
          }}
        />
      </View>
    );
  };

  return (
    <FormItem<CheckboxItemExtendedProps> {...props} render={renderSwitch} />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
