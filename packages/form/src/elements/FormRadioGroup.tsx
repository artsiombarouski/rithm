import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { RadioButton, RadioButtonGroupProps } from 'react-native-paper';
import { FormItem } from '../components';
import { StyleSheet, View } from 'react-native';

export type RadioButtonOption = {
  key: any;
  label?: string;
};

export type FormRadioGroupProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<RadioButtonGroupProps, 'onValueChange' | 'value' | 'children'> & {
      options: RadioButtonOption[];
    };

export function FormRadioGroup(props: FormRadioGroupProps) {
  const { options, ...restProps } = props;
  const renderRadioGroup = (
    props: RadioButtonGroupProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <View style={styles.container}>
        <RadioButton.Group
          {...props}
          onValueChange={field.onChange}
          value={field.value}
        >
          {options.map((option) => {
            return (
              <RadioButton.Item
                key={option.key}
                style={styles.item}
                value={option.key}
                label={option.label ?? option.key}
              />
            );
          })}
        </RadioButton.Group>
      </View>
    );
  };
  return (
    <FormItem<RadioButtonGroupProps> {...restProps} render={renderRadioGroup} />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  item: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
