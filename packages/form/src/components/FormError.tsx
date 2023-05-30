import { Text, useTheme } from 'react-native-paper';
import { FieldError } from 'react-hook-form';

export type FormErrorProps = {
  error?: FieldError;
};

export function FormError(props: FormErrorProps) {
  const { error } = props;
  const theme = useTheme();
  if (!error) {
    return <></>;
  }
  return (
    <Text style={[{ color: theme.colors.error }]} variant={'bodyMedium'}>
      {error?.message && error?.message?.length > 0
        ? error.message
        : error?.type === 'required'
        ? 'Field is required'
        : `Something wrong: ${error.type}`}
    </Text>
  );
}
