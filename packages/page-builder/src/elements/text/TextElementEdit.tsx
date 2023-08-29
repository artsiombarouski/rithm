import { PageBuilderElementEditProps } from '../../types';
import { FormInput, FormInputProps } from '@artsiombarouski/rn-form';
import { Box, IBoxProps } from 'native-base';

export type TextElementEditProps = PageBuilderElementEditProps &
  Partial<FormInputProps> & {
    containerProps?: IBoxProps;
  };

export const TextElementEdit = (props: TextElementEditProps) => {
  const { containerProps, ...restProps } = props;
  return (
    <Box {...containerProps}>
      <FormInput
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
        {...restProps}
      />
    </Box>
  );
};
