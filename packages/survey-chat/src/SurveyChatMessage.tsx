import { SurveyMessage } from './types';
import {
  Box,
  IBoxProps,
  ITextProps,
  PresenceTransition,
  Text,
} from 'native-base';
import { SurveyChatRunner } from './SurveyChatRunner';
import { GrowingComponent } from './components';

export type SurveyChatMessageStylingProps = {
  textProps?: ITextProps;
  containerProps?: IBoxProps;
};

export type SurveyChatMessageProps = {
  value: SurveyMessage;
  runner: SurveyChatRunner;
  messageProps?: SurveyChatMessageStylingProps;
  answerMessageProps?: SurveyChatMessageStylingProps;
};

export const SurveyChatMessage = (props: SurveyChatMessageProps) => {
  const { value, runner, answerMessageProps, messageProps } = props;
  const displayMessage =
    typeof value.message === 'function' ? value.message(runner) : value.message;
  const stylingProps = value.isAnswer ? answerMessageProps : messageProps;
  const layoutProps: IBoxProps = value.isAnswer
    ? {
        display: 'flex',
        alignItems: 'flex-end',
      }
    : {
        display: 'flex',
        alignItems: 'flex-start',
      };

  return (
    <GrowingComponent
      component={
        <PresenceTransition
          visible={true}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 100, duration: 400 } }}
        >
          <Box {...layoutProps}>
            <Box
              {...stylingProps?.containerProps}
              {...value?.messageStylingProps?.containerProps}
            >
              {typeof displayMessage === 'string' ? (
                <Text
                  {...stylingProps?.textProps}
                  {...value?.messageStylingProps?.textProps}
                >
                  {displayMessage}
                </Text>
              ) : (
                displayMessage
              )}
            </Box>
          </Box>
        </PresenceTransition>
      }
      componentStyle={{ width: '100%' }}
      componentWrapperStyle={{ width: '100%' }}
      containerStyle={{ width: '100%' }}
    />
  );
};
