import { Box, Button } from 'native-base';
import { useState } from 'react';
import { SurveyActionProps } from '../types';
import {
  AutocompleteInput,
  AutocompleteInputProps,
  AutocompleteOption,
} from '@artsiombarouski/rn-components/src/input';

export type SurveyAutocompleteActionProps = SurveyActionProps & {
  autocompleteProps: AutocompleteInputProps;
};

export const SurveyAutocompleteAction = (
  props: SurveyAutocompleteActionProps,
) => {
  const { onSubmit, question, autocompleteProps } = props;
  const [currentValue, setCurrentValue] = useState<AutocompleteOption>(null);
  const handleSubmit = () => {
    if (!currentValue) {
      onSubmit(null, null);
    } else {
      onSubmit(currentValue.key, currentValue.value);
    }
  };
  return (
    <Box>
      <AutocompleteInput
        onChange={(value) => {
          setCurrentValue(value);
        }}
        inputProps={{
          InputRightElement: (
            <Button
              isDisabled={!currentValue}
              variant={'link'}
              onPress={handleSubmit}
            >
              Answer
            </Button>
          ),
          ...autocompleteProps.inputProps,
        }}
        {...autocompleteProps}
      />
    </Box>
  );
};
