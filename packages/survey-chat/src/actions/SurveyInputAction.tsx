import { Box, Button, IInputProps, Input } from 'native-base';
import { ReactElement, useState } from 'react';
import { SurveyActionProps } from '../types';
import { useInputAutoHeight } from '@artsiombarouski/rn-form';

export type SurveyInputActionProps = SurveyActionProps & {
  inputProps?: IInputProps;
  actionElement?: (
    props: SurveyActionProps & { handleSubmit: () => void },
  ) => ReactElement;
};

export const SurveyInputAction = (props: SurveyInputActionProps) => {
  const { closeTooltip, onSubmit, inputProps, actionElement } = props;
  const [currentValue, setCurrentValue] = useState('');
  const autoHeightProps = useInputAutoHeight(props.inputProps ?? {}, true);
  const handleSubmit = () => {
    if (currentValue.length === 0) {
      onSubmit(null, currentValue);
    } else {
      onSubmit(currentValue.trim(), currentValue.trim());
    }
  };
  return (
    <Box>
      <Input
        onChangeText={(value) => {
          setCurrentValue(value);
          closeTooltip();
        }}
        InputRightElement={
          actionElement?.({ ...props, handleSubmit }) ?? (
            <Button variant={'link'} onPress={handleSubmit}>
              Answer
            </Button>
          )
        }
        {...inputProps}
        {...autoHeightProps}
      />
    </Box>
  );
};
