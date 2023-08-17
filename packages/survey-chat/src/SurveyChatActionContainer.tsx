import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  IconButton,
  IIconButtonProps,
  PresenceTransition,
  QuestionIcon,
  VStack,
} from 'native-base';
import { SurveyChatRunner } from './SurveyChatRunner';
import {
  ControlledTooltip,
  ControlledTooltipProps,
} from '@artsiombarouski/rn-components';
import { observe } from 'mobx';

export type SurveyActionContainerProps = {
  runner: SurveyChatRunner;
  tooltipProps?: Partial<ControlledTooltipProps>;
  tooltipButtonProps?: IIconButtonProps;
};

export const SurveyChatActionContainer = observer<SurveyActionContainerProps>(
  (props) => {
    const { runner, tooltipProps, tooltipButtonProps } = props;
    const canShowAction = runner.canShowAction;
    const currentQuestion = runner.currentQuestion;
    const [tooltipState, setTooltipState] = useState({
      visible: false,
      clicked: false,
    });

    useEffect(() => {
      const unsubscribe = observe(runner, 'canShowAction', (change) => {
        setTooltipState({
          visible: runner.currentQuestion?.tooltipInitialVisible === true,
          clicked: false,
        });
      });
      return () => {
        unsubscribe();
      };
    }, []);

    const tooltipElement =
      tooltipState.visible &&
      React.createElement(currentQuestion?.tooltip as any, {
        runner: runner,
        question: currentQuestion,
        close: () =>
          setTooltipState({
            visible: false,
            clicked: true,
          }),
      });

    const tooltipTriggerElement = canShowAction &&
      currentQuestion?.tooltip &&
      !tooltipState.visible && (
        <PresenceTransition
          visible={!tooltipState.visible}
          initial={{ opacity: 0 }}
        >
          <IconButton
            p={0}
            position={'absolute'}
            right={0}
            top={-44}
            onPress={() => {
              setTooltipState({
                visible: true,
                clicked: true,
              });
            }}
            icon={<QuestionIcon />}
            _icon={{
              size: '2xl',
            }}
            borderRadius={'full'}
            {...tooltipButtonProps}
          />
        </PresenceTransition>
      );

    const actionElement = canShowAction && currentQuestion?.surveyAction && (
      <PresenceTransition
        visible={true}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 400 } }}
      >
        {React.createElement(currentQuestion!.surveyAction!, {
          runner: runner,
          question: currentQuestion,
          openTooltip: () => {
            setTooltipState({
              visible: true,
              clicked: true,
            });
          },
          closeTooltip: () => {
            setTooltipState((prevState) => ({
              ...prevState,
              visible: false,
            }));
          },
          onSubmit: (value: any, message: any) => {
            runner.setAnswer(
              currentQuestion?.dataKey ?? currentQuestion?.key,
              value,
              message,
            );
            return runner.next();
          },
        })}
      </PresenceTransition>
    );

    const contentElement = (
      <VStack>
        {tooltipTriggerElement}
        {actionElement}
      </VStack>
    );

    return (
      <ControlledTooltip
        label={tooltipElement as any}
        isOpen={tooltipState.visible}
        placement={'top'}
        hasArrow={true}
        maxW={'500px'}
        {...tooltipProps}
      >
        {contentElement}
      </ControlledTooltip>
    );
  },
);
