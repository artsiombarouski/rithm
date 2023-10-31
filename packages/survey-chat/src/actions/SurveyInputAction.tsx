import { SurveyActionProps } from '../types';
import { useInputAutoHeight } from '@artsiombarouski/rn-form';
import { Box, Button, IInputProps, Input } from 'native-base';
import { ReactElement, useState } from 'react';

export type SurveyInputActionProps = SurveyActionProps & {
  inputProps?: IInputProps;
  actionElement?: (
    props: SurveyActionProps & {
      handleSubmit: () => void;
      isButtonDisabled: boolean;
    },
  ) => ReactElement;
  required?: boolean;
};

export const SurveyInputAction = (props: SurveyInputActionProps) => {
  const {
    closeTooltip,
    onSubmit,
    inputProps,
    actionElement,
    required = true,
  } = props;
  const [currentValue, setCurrentValue] = useState('');
  const autoHeightProps = useInputAutoHeight(props.inputProps ?? {}, true);
  const handleSubmit = () => {
    if (currentValue && currentValue.length > 0) {
      onSubmit(currentValue.trim(), currentValue.trim());
    } else if (!required) {
      onSubmit(null, null);
    }
  };

  const isButtonDisabled =
    required && (!currentValue || currentValue.length === 0);

  return (
    <Box>
      <Input
        onChangeText={(value) => {
          setCurrentValue(value);
          closeTooltip();
        }}
        InputRightElement={
          actionElement?.({ ...props, handleSubmit, isButtonDisabled }) ?? (
            <Button
              variant={'link'}
              onPress={handleSubmit}
              isDisabled={isButtonDisabled}
            >
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
