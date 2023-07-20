import { SurveyChatRunner } from './SurveyChatRunner';
import { observer } from 'mobx-react-lite';
import { Box, HStack, IBoxProps, PresenceTransition, View } from 'native-base';
import { TypingIndicator, TypingIndicatorProps } from './components';

export type IndicatorProps = {
  containerProps?: IBoxProps;
  indicatorProps?: TypingIndicatorProps;
};

export type SurveyChatFooterProps = {
  runner: SurveyChatRunner;
  indicatorProps?: IndicatorProps;
};

export const SurveyChatFooter = observer<SurveyChatFooterProps>((props) => {
  const { runner, indicatorProps } = props;
  return (
    <View>
      {runner.canShowTypingIndicator && (
        <PresenceTransition visible={true} initial={{ opacity: 0 }}>
          <HStack>
            <Box {...indicatorProps?.containerProps}>
              <TypingIndicator {...indicatorProps?.indicatorProps} />
            </Box>
          </HStack>
        </PresenceTransition>
      )}
    </View>
  );
});
