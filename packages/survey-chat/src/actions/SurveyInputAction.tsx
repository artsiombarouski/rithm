import { Box, Button, IInputProps, Input } from 'native-base';
import { ReactElement, useState } from 'react';
import { SurveyActionProps } from '../types';
import { useInputAutoHeight } from '@artsiombarouski/rn-form';

export type SurveyInputActionProps = SurveyActionProps & {
  inputProps?: IInputProps;
  actionElement?: (
    props: SurveyActionProps & { handleSubmit: () => void },
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
  return (
    <Box>
      <Input
        onChangeText={(value) => {
          setCurrentValue(value);
          closeTooltip();
        }}
        InputRightElement={
          actionElement?.({ ...props, handleSubmit }) ?? (
            <Button
              variant={'link'}
              onPress={handleSubmit}
              isDisabled={
                required && (!currentValue || currentValue.length === 0)
              }
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
