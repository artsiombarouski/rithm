import { Box, Spacer, useTheme } from 'native-base';
import {
  SurveyAutocompleteAction,
  SurveyChat,
  SurveyDropDownAction,
  SurveyInputAction,
  SurveyQuestion,
} from '@artsiombarouski/rn-survey-chat';

const questions: SurveyQuestion[] = [
  {
    key: 'preTextInput',
    message: 'Now will be text input',
  },
  {
    key: 'textInput',
    message: 'Here is text input',
    surveyAction: (props) => <SurveyInputAction {...props} />,
  },
  {
    key: 'preAutocomplete',
    message: 'Now will be autocomplete',
  },
  {
    key: 'autocomplete',
    message: 'Here is autocomplete',
    surveyAction: (props) => (
      <SurveyAutocompleteAction
        {...props}
        autocompleteProps={{
          getOptions: async (query) => {
            return [
              { key: 'k1', value: 'Value 1' },
              { key: 'k2', value: 'Value 2' },
              { key: 'k3', value: 'Value 3' },
            ].filter((e) =>
              e.value.toLowerCase().includes(query.toLowerCase()),
            );
          },
        }}
      />
    ),
  },
  {
    key: 'preDropDown',
    message: 'Now will be drop down',
  },
  {
    key: 'dropDown',
    message: 'Here is drop down',
    surveyAction: (props) => (
      <SurveyDropDownAction
        {...props}
        dropDownProps={{
          options: [...new Array(100)].map((_, index) => ({
            key: `kd${index}`,
            label: `Value ${index}`,
          })),
        }}
      />
    ),
  },
];

export default function SurveyPage() {
  const theme = useTheme();
  return (
    <Box flex={1}>
      <SurveyChat
        questions={questions}
        containerProps={{
          p: 4,
          maxW: 512,
        }}
        onComplete={(answers) => {
          console.log('onComplete', answers);
        }}
        messageProps={{
          messageProps: {
            containerProps: {
              px: 2,
              py: 1,
              backgroundColor: theme.colors.black,
              borderRadius: 4,
            },
            textProps: {
              color: theme.colors.white,
            },
          },
          answerMessageProps: {
            containerProps: {
              px: 2,
              py: 1,
              backgroundColor: theme.colors.primary['500'],
              borderRadius: 4,
            },
            textProps: {
              color: theme.colors.white,
            },
          },
        }}
        indicatorProps={{
          containerProps: {
            px: 1,
            py: 2,
            backgroundColor: theme.colors.primary['500'],
            borderRadius: 4,
            mt: 2,
          },
          indicatorProps: {
            dotStyle: {
              backgroundColor: 'white',
            },
          },
        }}
        listProps={{
          inverted: true,
          py: 4,
          ItemSeparatorComponent: () => <Spacer h={2} />,
        }}
      />
    </Box>
  );
}
