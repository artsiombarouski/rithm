import { Box, Button, IInputProps, Input } from 'native-base';
import { useState } from 'react';
import { SurveyActionProps } from '../types';

export type SurveyInputActionProps = SurveyActionProps & {
  inputProps?: IInputProps;
};

export const SurveyInputAction = (props: SurveyInputActionProps) => {
  const { onSubmit, question, inputProps } = props;
  const [currentValue, setCurrentValue] = useState('');
  const handleSubmit = () => {
    if (currentValue.length === 0) {
      onSubmit(null, currentValue);
    } else {
      onSubmit(currentValue, currentValue);
    }
  };
  return (
    <Box>
      <Input
        onChangeText={(value) => {
          setCurrentValue(value);
        }}
        InputRightElement={
          <Button variant={'link'} onPress={handleSubmit}>
            Answer
          </Button>
        }
        {...inputProps}
      />
    </Box>
  );
};
