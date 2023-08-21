import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, IBoxProps, IIconButtonProps } from 'native-base';
import { SurveyMessage, SurveyQuestion } from './types';
import { SurveyChatRunner, SurveyChatRunnerOptions } from './SurveyChatRunner';
import { SurveyChatMessageStylingProps } from './SurveyChatMessage';
import { IndicatorProps } from './SurveyChatFooter';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { toJS } from 'mobx';
import { SurveyChatActionContainer } from './SurveyChatActionContainer';
import { ControlledTooltipProps } from '@artsiombarouski/rn-components';
import { IViewProps } from 'native-base/lib/typescript/components/primitives/View';
import { SurveyChatList } from './SurveyChatList';

export type SurveyChatProps = {
  questions?: SurveyQuestion[];
  onComplete?: (answers: { [key: string]: any }) => void;
  containerProps?: IBoxProps;
  listProps?: Partial<IFlatListProps<SurveyMessage>>;
  messageProps?: {
    messageProps?: SurveyChatMessageStylingProps;
    answerMessageProps?: SurveyChatMessageStylingProps;
  };
  footerWrapperProps?: IViewProps;
  indicatorProps?: IndicatorProps;
  tooltipProps?: Partial<ControlledTooltipProps>;
  tooltipButtonProps?: IIconButtonProps;
  runnerOptions?: SurveyChatRunnerOptions;
  actionContainerProps?: IViewProps;
};

export const SurveyChat = observer<SurveyChatProps>((props) => {
  const {
    questions,
    onComplete,
    containerProps,
    listProps,
    messageProps,
    footerWrapperProps,
    indicatorProps,
    tooltipProps,
    tooltipButtonProps,
    runnerOptions,
    actionContainerProps,
  } = props;
  const runner = useLocalObservable(
    () => new SurveyChatRunner(questions ?? [], runnerOptions),
  );

  useEffect(() => {
    runner.init().then((ignore) => {});
  }, [runner]);

  useEffect(() => {
    if (runner.isCompleted) {
      onComplete?.(toJS(runner.answers));
    }
  }, [runner.isCompleted]);

  return (
    <Box flex={1} {...containerProps}>
      <SurveyChatList
        flex={1}
        runner={runner}
        messageProps={messageProps}
        footerWrapperProps={footerWrapperProps}
        indicatorProps={indicatorProps}
        {...listProps}
      />
      <SurveyChatActionContainer
        runner={runner}
        tooltipProps={tooltipProps}
        tooltipButtonProps={tooltipButtonProps}
        {...actionContainerProps}
      />
    </Box>
  );
});
