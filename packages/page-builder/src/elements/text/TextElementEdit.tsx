import { PageBuilderElementEditProps } from '../../types';
import { FormInput, FormInputProps } from '@artsiombarouski/rn-form';

export type TextElementEditProps = PageBuilderElementEditProps &
  Partial<FormInputProps>;

export const TextElementEdit = (props: TextElementEditProps) => {
  return (
    <FormInput
      {...props}
      multiline={true}
      keepErrorSpace={false}
      borderStyle={'none'}
      variant={'unstyled'}
      p={3}
      textAlignVertical={'top'}
      borderColor={'transparent'}
      placeholder={'Add some text here'}
      _input={{
        minHeight: '120px',
      }}
    />
  );
};
