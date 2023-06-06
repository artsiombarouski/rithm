import { FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { ISwitchProps, ITextProps, Switch, Text } from 'native-base';
import { StyleSheet, View } from 'react-native';

export type ExtendedSwitchProps = ISwitchProps & {
  label?: string;
  labelProps?: Partial<ITextProps>;
};

export type FormSwitchProps<T extends FormValues = FormValues> =
  FormItemProps<T> & ExtendedSwitchProps;

export const FormSwitch = (props: FormSwitchProps) => {
  const renderSwitch = (
    { label, labelProps, ...restSwitchProps }: ExtendedSwitchProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <View style={styles.container}>
        {label && (
          <Text
            style={[styles.label]}
            fontSize={restSwitchProps.fontSize ?? 'md'}
            {...labelProps}
          >
            {label}
          </Text>
        )}
        <Switch
          {...restSwitchProps}
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
  label: {
    flexShrink: 1,
    flexGrow: 1,
  },
});
