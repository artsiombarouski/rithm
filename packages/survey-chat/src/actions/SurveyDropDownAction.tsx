import { Box, Button } from 'native-base';
import { ReactElement, useState } from 'react';
import { SurveyActionProps } from '../types';
import {
  DropDownPicker,
  DropDownPickerOption,
  DropDownPickerProps,
} from '@artsiombarouski/rn-components/src/dropdown';

export type SurveyDropDownActionProps = SurveyActionProps & {
  dropDownProps: DropDownPickerProps;
  actionElement?: (
    props: SurveyActionProps & { handleSubmit: () => void },
  ) => ReactElement;
  required?: boolean;
};

export const SurveyDropDownAction = (props: SurveyDropDownActionProps) => {
  const {
    closeTooltip,
    onSubmit,
    dropDownProps,
    actionElement,
    required = true,
  } = props;
  const [currentValue, setCurrentValue] = useState<DropDownPickerOption>(null);
  const handleSubmit = () => {
    if (currentValue) {
      onSubmit(currentValue.key, currentValue.label ?? currentValue.key);
    } else if (required) {
      onSubmit(null, null);
    }
  };
  return (
    <Box>
      <DropDownPicker
        onChange={(value) => {
          setCurrentValue(value);
          closeTooltip();
        }}
        onOpen={() => {
          closeTooltip();
        }}
        value={currentValue?.key}
        inputProps={{
          InputRightElement: actionElement?.({ ...props, handleSubmit }) ?? (
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
