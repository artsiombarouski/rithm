import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, FlatList, IBoxProps, IIconButtonProps } from 'native-base';
import { SurveyMessage, SurveyQuestion } from './types';
import { SurveyChatRunner } from './SurveyChatRunner';
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

export type SurveyChatProps = {
  questions?: SurveyQuestion[];
  onComplete?: (answers: { [key: string]: any }) => void;
  containerProps?: IBoxProps;
  listProps?: Partial<IFlatListProps<SurveyMessage>>;
  messageProps?: {
    messageProps?: SurveyChatMessageStylingProps;
    answerMessageProps?: SurveyChatMessageStylingProps;
  };
  indicatorProps?: IndicatorProps;
  tooltipProps?: Partial<ControlledTooltipProps>;
  tooltipButtonProps?: IIconButtonProps;
};

export const SurveyChat = observer<SurveyChatProps>((props) => {
  const {
    questions,
    onComplete,
    containerProps,
    listProps,
    messageProps,
    indicatorProps,
    tooltipProps,
    tooltipButtonProps,
  } = props;
  const runner = useLocalObservable(
    () => new SurveyChatRunner(questions ?? []),
  );

  const renderMessage = ({ item }: ListRenderItemInfo<SurveyMessage>) => {
    return <SurveyChatMessage value={item} runner={runner} {...messageProps} />;
  };

  const renderFooter = () => {
    return <SurveyChatFooter runner={runner} indicatorProps={indicatorProps} />;
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
  const data = runner.messages.slice();

  return (
    <Box flex={1} {...containerProps}>
      <FlatList
        flex={1}
        data={isInverted ? data.reverse() : data}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        ListFooterComponent={!isInverted && renderFooter()}
        ListHeaderComponent={isInverted && renderFooter()}
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
