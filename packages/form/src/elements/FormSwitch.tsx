import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { Switch, SwitchProps, Text } from 'react-native-paper';
import { FormItem } from '../components';
import { StyleSheet, View } from 'react-native';

export type ExtendedSwitchProps = SwitchProps & {
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
          <Text style={[styles.label]} variant={'bodyLarge'}>
            {label}
          </Text>
        )}
        <Switch
          {...restSwitchProps}
          ref={field.ref}
          style={[styles.switch, restSwitchProps.style]}
          value={field.value}
          onValueChange={field.onChange}
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
    paddingVertical: 8,
  },
  switch: {
    margin: 8,
  },
  label: {
    flexShrink: 1,
    flexGrow: 1,
  },
});
