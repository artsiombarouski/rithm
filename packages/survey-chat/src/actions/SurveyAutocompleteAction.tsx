import { Box, Button } from 'native-base';
import { ReactElement, useState } from 'react';
import { SurveyActionProps } from '../types';
import {
  AutocompleteInput,
  AutocompleteInputProps,
  AutocompleteOption,
} from '@artsiombarouski/rn-components/src/input';

export type SurveyAutocompleteActionProps = SurveyActionProps & {
  autocompleteProps: AutocompleteInputProps;
  actionElement?: (
    props: SurveyActionProps & { handleSubmit: () => void },
  ) => ReactElement;
};

export const SurveyAutocompleteAction = (
  props: SurveyAutocompleteActionProps,
) => {
  const { closeTooltip, onSubmit, autocompleteProps, actionElement } = props;
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
        {...autocompleteProps}
        onChange={(value) => {
          setCurrentValue(value);
          closeTooltip();
        }}
        inputProps={{
          onChangeText: () => {
            closeTooltip();
          },
          InputRightElement: actionElement?.({ ...props, handleSubmit }) ?? (
            <Button
              variant={'link'}
              onPress={handleSubmit}
              isDisabled={!currentValue}
            >
              Answer
            </Button>
          ),
          ...autocompleteProps.inputProps,
        }}
      />
    </Box>
  );
};
