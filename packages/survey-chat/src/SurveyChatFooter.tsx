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
    <View
      {...wrapperProps}
      style={{ opacity: runner.canShowTypingIndicator ? 1 : 0 }}
    >
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
