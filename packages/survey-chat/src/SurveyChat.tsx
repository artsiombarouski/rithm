import React, { useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Box, FlatList, IBoxProps } from 'native-base';
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
};

export const SurveyChat = observer<SurveyChatProps>((props) => {
  const {
    questions,
    onComplete,
    containerProps,
    listProps,
    messageProps,
    indicatorProps,
  } = props;
  const runner = useLocalObservable(
    () => new SurveyChatRunner(questions ?? []),
  );
  const currentQuestion = runner.currentQuestion;

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

  const isInverted = listProps.inverted;
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
      <Box>
        {currentQuestion?.surveyAction &&
          React.createElement(currentQuestion?.surveyAction as any, {
            runner: runner,
            onSubmit: (value: any, message: any) => {
              runner.setAnswer(
                currentQuestion?.dataKey ?? currentQuestion?.key,
                value,
                message,
              );
              return runner.next();
            },
          })}
      </Box>
    </Box>
  );
});
