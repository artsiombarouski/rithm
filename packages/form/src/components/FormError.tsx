import { FormControl, IFormControlErrorMessageProps } from 'native-base';
import { FieldError } from 'react-hook-form';

export type FormErrorProps = {
  error?: FieldError;
  errorProps?: IFormControlErrorMessageProps;
};

export function FormError(props: FormErrorProps) {
  const { error, ...restProps } = props || {};
  //todo: add theme
  return (
    <FormControl.ErrorMessage {...restProps}>
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
