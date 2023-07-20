import { Box, Button } from 'native-base';
import { useState } from 'react';
import { SurveyActionProps } from '../types';
import {
  DropDownPicker,
  DropDownPickerOption,
  DropDownPickerProps,
} from '@artsiombarouski/rn-components/src/dropdown';

export type SurveyDropDownActionProps = SurveyActionProps & {
  dropDownProps: DropDownPickerProps;
};

export const SurveyDropDownAction = (props: SurveyDropDownActionProps) => {
  const { onSubmit, question, dropDownProps } = props;
  const [currentValue, setCurrentValue] = useState<DropDownPickerOption>(null);
  const handleSubmit = () => {
    if (!currentValue) {
      onSubmit(null, null);
    } else {
      onSubmit(currentValue.key, currentValue.label ?? currentValue.key);
    }
  };
  return (
    <Box>
      <DropDownPicker
        onChange={(value) => {
          setCurrentValue(value);
        }}
        value={currentValue?.key}
        inputProps={{
          InputRightElement: (
            <Button
              variant={'link'}
              onPress={handleSubmit}
              isDisabled={!currentValue}
            >
              Answer
            </Button>
          ),
        }}
        {...dropDownProps}
      />
    </Box>
  );
};
