import { Text } from 'react-native-paper';

export type FormTitleProps = {
  title?: string;
};

export const FormTitle = (props: FormTitleProps) => {
  if (!props.title) {
    return <></>;
  }
  return <Text variant={'titleMedium'}>{props.title}</Text>;
};
