import { SurveyChatRunner } from './SurveyChatRunner';
import { observer } from 'mobx-react-lite';
import { FlatList } from 'native-base';
import React, { useMemo } from 'react';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { SurveyMessage } from './types';
import { IndicatorProps, SurveyChatFooter } from './SurveyChatFooter';
import { ListRenderItemInfo } from 'react-native';
import {
  SurveyChatMessage,
  SurveyChatMessageStylingProps,
} from './SurveyChatMessage';
import { IViewProps } from 'native-base/lib/typescript/components/primitives/View';

export type SurveyChatListProps = Partial<IFlatListProps<SurveyMessage>> & {
  runner: SurveyChatRunner;
  messageProps?: {
    messageProps?: SurveyChatMessageStylingProps;
    answerMessageProps?: SurveyChatMessageStylingProps;
  };
  footerWrapperProps?: IViewProps;
  indicatorProps?: IndicatorProps;
};

export const SurveyChatList = observer<SurveyChatListProps>((props) => {
  const {
    runner,
    messageProps,
    footerWrapperProps,
    indicatorProps,
    ...restProps
  } = props;

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

  const renderMessage = ({ item }: ListRenderItemInfo<any>) => {
    if (item === 'footer') {
      return footer;
    }
    return <SurveyChatMessage value={item} runner={runner} {...messageProps} />;
  };

  const isInverted = restProps?.inverted;
  const data: any[] = runner.messages.slice();
  data.push('footer');

  return (
    <FlatList<any>
      key={'survey-chat-list'}
      flex={1}
      data={isInverted ? data.reverse() : data}
      showsVerticalScrollIndicator={false}
      disableVirtualization={true}
      renderItem={renderMessage}
      keyExtractor={(item) => (item === 'footer' ? 'footer' : item.key)}
      {...restProps}
    />
  );
});
