import { FormElementRenderProps, FormItemProps } from '../types';
import { TextInput, TextInputProps } from 'react-native-paper';
import { FieldValues } from 'react-hook-form';
import { FormItem } from '../components';

export type FormInputProps<T extends FieldValues = FieldValues> =
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
        error={!!renderProps.fieldState?.error}
        mode={'outlined'}
      />
    );
  };

  return <FormItem<TextInputProps> {...props} render={renderInput} />;
};
