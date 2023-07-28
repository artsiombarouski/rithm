import { FormValues } from '../types';
import {
  FormInput,
  FormInputProps,
  NoSpaceFormInputFormatter,
} from './FormInput';
import { MaterialIcons } from '@expo/vector-icons';
import { Icon, Pressable } from 'native-base';
import React from 'react';

export type FormPasswordInputProps<T extends FormValues = FormValues> =
  FormInputProps<T>;

export const FormPasswordInput = (props: FormPasswordInputProps) => {
  const [show, setShow] = React.useState(false);

  return (
    <FormInput
      type={show ? 'text' : 'password'}
      formatters={[NoSpaceFormInputFormatter]}
      InputRightElement={
        <Pressable onPress={() => setShow(!show)}>
          <Icon
            as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
            size={5}
            mr="2"
            color="muted.400"
          />
        </Pressable>
      }
      {...props}
    />
  );
};
