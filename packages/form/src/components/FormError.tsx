import { FormControl } from 'native-base';
import { FieldError } from 'react-hook-form';

export type FormErrorProps = {
  error?: FieldError;
};

export function FormError(props: FormErrorProps) {
  const { error } = props || {};
  //todo: add theme
  return (
    <FormControl.ErrorMessage>
      {error
        ? error.message
          ? error.message
          : error.type === 'required'
          ? 'Field is required'
          : `Something wrong: ${error?.type}`
        : null}
    </FormControl.ErrorMessage>
  );
}
