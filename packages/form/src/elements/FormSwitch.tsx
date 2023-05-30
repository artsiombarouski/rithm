import { FieldValues } from 'react-hook-form';
import { FormElementRenderProps, FormItemProps } from '../types';
import { Switch, SwitchProps } from 'react-native-paper';
import { FormItem } from '../components';

export type FormSwitchProps<T extends FieldValues = FieldValues> =
  FormItemProps<T> & SwitchProps;

export const FormSwitch = (props: FormSwitchProps) => {
  const renderSwitch = (
    props: SwitchProps,
    { field }: FormElementRenderProps,
  ) => {
    return (
      <Switch
        {...props}
        ref={field.ref}
        value={field.value}
        onValueChange={field.onChange}
      />
    );
  };

  return <FormItem<FormSwitchProps> {...props} render={renderSwitch} />;
};
