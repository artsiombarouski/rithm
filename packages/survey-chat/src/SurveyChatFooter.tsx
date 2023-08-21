import { SurveyChatRunner } from './SurveyChatRunner';
import { observer } from 'mobx-react-lite';
import { Box, HStack, IBoxProps, PresenceTransition, View } from 'native-base';
import { TypingIndicator, TypingIndicatorProps } from './components';
import { IViewProps } from 'native-base/lib/typescript/components/primitives/View';

export type IndicatorProps = {
  containerProps?: IBoxProps;
  indicatorProps?: TypingIndicatorProps;
};

export type SurveyChatFooterProps = {
  runner: SurveyChatRunner;
  wrapperProps?: IViewProps;
  indicatorProps?: IndicatorProps;
};

export const SurveyChatFooter = observer<SurveyChatFooterProps>((props) => {
  const { runner, wrapperProps, indicatorProps } = props;
  return (
    <View {...wrapperProps}>
      <PresenceTransition
        visible={runner.canShowTypingIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 100, duration: 200 } }}
      >
        <HStack>
          <Box {...indicatorProps?.containerProps}>
            <TypingIndicator {...indicatorProps?.indicatorProps} />
          </Box>
        </HStack>
      </PresenceTransition>
    </View>
  );
});
