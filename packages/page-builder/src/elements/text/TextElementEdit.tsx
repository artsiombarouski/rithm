import { PageBuilderElementEditProps } from '../../types';
import { FormInput } from '@artsiombarouski/rn-form';

export const TextElementEdit = (props: PageBuilderElementEditProps) => {
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
