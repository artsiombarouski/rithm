import { FormElementRenderProps, FormItemProps, FormValues } from '../types';
import { TextInput, TextInputProps } from 'react-native-paper';
import { FormItem } from '../components';
import { StyleSheet } from 'react-native';

export type FormInputProps<T extends FormValues = FormValues> =
  FormItemProps<T> & TextInputProps;

export const FormInput = (props: FormInputProps) => {
  const renderInput = (
    props: TextInputProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <TextInput
        {...props}
        {...renderProps.field}
        value={renderProps.field.value}
        onChangeText={renderProps.field.onChange}
        style={StyleSheet.flatten([styles.inputStyle, props.style])}
        error={!!renderProps.fieldState?.error}
        mode={'outlined'}
      />
    );
  };

  return <FormItem<TextInputProps> {...props} render={renderInput} />;
};

const styles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    marginTop: -4,
  },
});
