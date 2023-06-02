import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Switch, ISwitchProps, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

export type ExtendedSwitchProps = ISwitchProps & {
  label?: string;
};

export type FormSwitchProps<T extends FormValues = FormValues> =
  FormItemProps<T> & ExtendedSwitchProps;

export const FormSwitch = (props: FormSwitchProps) => {
  const renderSwitch = (
    { label, ...restSwitchProps }: ExtendedSwitchProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label]} fontSize={'lg'}>
            {label}
          </Text>
        )}
        <Switch
          {...restSwitchProps}
          style={[styles.switch, restSwitchProps.style]}
          value={field.value}
          onToggle={field.onChange}
        />
      </View>
    );
  };

  return <FormItem<ExtendedSwitchProps> {...props} render={renderSwitch} />;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    marginHorizontal: 8,
    borderWidth: 0, //when isInvalid - true border breaks styles
  },
  label: {
    flexShrink: 1,
    flexGrow: 1,
  },
});
