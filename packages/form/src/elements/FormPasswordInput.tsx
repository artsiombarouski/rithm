import React from 'react';
import { FormValues } from '../types';
import { FormInput, FormInputProps } from './FormInput';
import { Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export type FormPasswordInputProps<T extends FormValues = FormValues> =
  FormInputProps<T>;

export const FormPasswordInput = (props: FormPasswordInputProps) => {
  const [show, setShow] = React.useState(false);

  return (
    <FormInput
      type={show ? 'text' : 'password'}
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
