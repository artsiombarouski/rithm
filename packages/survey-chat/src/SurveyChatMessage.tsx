import { SurveyMessage } from './types';
import {
  Box,
  IBoxProps,
  ITextProps,
  PresenceTransition,
  Text,
} from 'native-base';
import { SurveyChatRunner } from './SurveyChatRunner';

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
    <PresenceTransition visible={true} initial={{ opacity: 0 }}>
      <Box {...layoutProps}>
        <Box {...stylingProps?.containerProps}>
          {typeof displayMessage === 'string' ? (
            <Text {...stylingProps?.textProps}>{displayMessage}</Text>
          ) : (
            displayMessage
          )}
        </Box>
      </Box>
    </PresenceTransition>
  );
};
