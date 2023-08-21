import {
  Box,
  CloseIcon,
  Heading,
  HStack,
  IconButton,
  Spacer,
  Text,
  useTheme,
  VStack,
} from 'native-base';
import {
  SurveyAutocompleteAction,
  SurveyChat,
  SurveyDropDownAction,
  SurveyInputAction,
  SurveyQuestion,
  SurveyTooltipProps,
} from '@artsiombarouski/rn-survey-chat';

const Tooltip = (props: SurveyTooltipProps) => {
  return (
    <Box>
      <HStack w={'100%'} space={'sm'} p={2}>
        <Text fontSize={24} lineHeight={24}>
          😀
        </Text>
        <VStack flex={1} space={'2xs'}>
          <HStack>
            <Heading flex={1} fontSize={'md'}>
              Good Example
            </Heading>
            <IconButton
              p={1}
              icon={<CloseIcon />}
              size={'xs'}
              onPress={props.close}
              rounded={'full'}
            />
          </HStack>
          <Text fontSize={12}>
            “I've recently gone through a pretty tough breakup. I thought I was
            okay at first, but it's been a few months and I can't seem to shake
            this feeling of loneliness and self-doubt. It's gotten to the point
            where I'm questioning my self-worth and I don't want to feel like
            this anymore.”
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const questions: SurveyQuestion[] = [
  {
    key: 'customStyle',
    message: 'Custom style example',
    messageStylingProps: {
      containerProps: {
        backgroundColor: 'red.900',
      },
    },
  },
  {
    key: 'preTextInput',
    message: 'Now will be text input',
  },
  {
    key: 'textInput',
    message: 'Here is text input',
    tooltipInitialVisible: true,
    tooltip: (props) => <Tooltip {...props} />,
    surveyAction: (props) => (
      <SurveyInputAction
        {...props}
        inputProps={{
          multiline: true,
        }}
      />
    ),
  },
  {
    key: 'preAutocomplete',
    message: 'Now will be autocomplete',
  },
  {
    key: 'autocomplete',
    message: 'Here is autocomplete',
    tooltip: (props) => <Tooltip {...props} />,
    tooltipInitialVisible: true,
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
          maxW: 512,
        }}
        onComplete={(answers) => {
          console.log('onComplete', answers);
        }}
        tooltipProps={{
          bgColor: 'white',
          borderRadius: 16,
          borderWidth: 1,
          maxW: 512,
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
        footerWrapperProps={{
          paddingBottom: 200,
        }}
        indicatorProps={{
          containerProps: {
            px: 1,
            py: 2,
            backgroundColor: theme.colors.primary['500'],
            borderRadius: 4,
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
          px: 4,
          ItemSeparatorComponent: () => <Spacer h={2} />,
        }}
        actionContainerProps={{
          px: 4,
          pt: 1,
          pb: 4,
        }}
        tooltipButtonProps={{
          right: 4,
        }}
      />
    </Box>
  );
}
