import { FormValues } from '../types';
import {
  FormInput,
  FormInputProps,
  NumericFormInputFormatter,
} from './FormInput';

type FormNumericInputType<T extends FormValues = FormValues> =
  FormInputProps<T>;

export const FormNumericInput = (props: FormNumericInputType) => {
  return (
    <FormInput
      inputMode={'numeric'}
      formatters={[NumericFormInputFormatter]}
      {...props}
    />
  );
};
