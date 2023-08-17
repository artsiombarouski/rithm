import React, { useEffect, useMemo } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, FlatList, IBoxProps, IIconButtonProps } from 'native-base';
import { SurveyMessage, SurveyQuestion } from './types';
import { SurveyChatRunner, SurveyChatRunnerOptions } from './SurveyChatRunner';
import { ListRenderItemInfo } from 'react-native';
import {
  SurveyChatMessage,
  SurveyChatMessageStylingProps,
} from './SurveyChatMessage';
import { IndicatorProps, SurveyChatFooter } from './SurveyChatFooter';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { toJS } from 'mobx';
import { SurveyChatActionContainer } from './SurveyChatActionContainer';
import { ControlledTooltipProps } from '@artsiombarouski/rn-components';
import { IViewProps } from 'native-base/lib/typescript/components/primitives/View';

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
  } = props;
  const runner = useLocalObservable(
    () => new SurveyChatRunner(questions ?? [], runnerOptions),
  );
  const footer = useMemo(() => {
    return (
      <SurveyChatFooter
        key={'chat-footer'}
        runner={runner}
        wrapperProps={footerWrapperProps}
        indicatorProps={indicatorProps}
      />
    );
  }, [runner, footerWrapperProps, indicatorProps]);

  const renderMessage = ({ item, index }: ListRenderItemInfo<any>) => {
    if (item === 'footer') {
      return footer;
    }
    return <SurveyChatMessage value={item} runner={runner} {...messageProps} />;
  };

  useEffect(() => {
    runner.init();
  }, [runner]);

  useEffect(() => {
    if (runner.isCompleted) {
      onComplete?.(toJS(runner.answers));
    }
  }, [runner.isCompleted]);

  const isInverted = listProps?.inverted;
  const data: any[] = runner.messages.slice();
  data.push('footer');

  return (
    <Box flex={1} {...containerProps}>
      <FlatList<any>
        key={'survey-chat-list'}
        flex={1}
        data={isInverted ? data.reverse() : data}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        keyExtractor={(item) => (item === 'footer' ? 'footer' : item.key)}
        {...listProps}
      />
      <SurveyChatActionContainer
        runner={runner}
        tooltipProps={tooltipProps}
        tooltipButtonProps={tooltipButtonProps}
      />
    </Box>
  );
});
