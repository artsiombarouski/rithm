import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  IconButton,
  IIconButtonProps,
  PresenceTransition,
  QuestionIcon,
  View,
  VStack,
} from 'native-base';
import { SurveyChatRunner } from './SurveyChatRunner';
import {
  ControlledTooltip,
  ControlledTooltipProps,
} from '@artsiombarouski/rn-components';
import { observe } from 'mobx';
import { GrowingComponent } from './components';
import { IViewProps } from 'native-base/lib/typescript/components/primitives/View';

export type SurveyActionContainerProps = IViewProps & {
  runner: SurveyChatRunner;
  tooltipProps?: Partial<ControlledTooltipProps>;
  tooltipButtonProps?: IIconButtonProps;
};

export const SurveyChatActionContainer = observer<SurveyActionContainerProps>(
  (props) => {
    const { runner, tooltipProps, tooltipButtonProps, ...restProps } = props;
    const contentRef = useRef();
    const canShowAction = runner.canShowAction;
    const currentQuestion = runner.currentQuestion;
    const [tooltipState, setTooltipState] = useState({
      visible: false,
      clicked: false,
      displayPending: false,
    });
    const [exiting, setExiting] = useState(false);

    const hideComponent = async (callback: () => void) => {
      setExiting(true);
      await new Promise((resolve) => setTimeout(resolve, 400)).then(() => {
        setExiting(false);
        callback();
      });
    };

    useEffect(() => {
      let mounted = false;
      const unsubscribe = observe(runner, 'canShowAction', (change) => {
        setTooltipState((prevState) => ({
          ...prevState,
          visible: false,
          clicked: false,
          displayPending: true,
        }));
        setExiting(false);
        if (runner.currentQuestion?.tooltipInitialVisible === true) {
          setTimeout(() => {
            setTooltipState((prevState) => ({
              ...prevState,
              visible: true,
              displayPending: false,
            }));
          }, 400);
        }
      });
      return () => {
        mounted = false;
        unsubscribe();
      };
    }, []);

    const tooltipElement =
      tooltipState.visible &&
      React.createElement(currentQuestion?.tooltip as any, {
        runner: runner,
        question: currentQuestion,
        close: () =>
          setTooltipState((prevState) => ({
            ...prevState,
            visible: false,
            clicked: true,
            displayPending: false,
          })),
      });

    const tooltipTriggerElement = canShowAction && currentQuestion?.tooltip && (
      <PresenceTransition
        visible={
          currentQuestion.tooltip &&
          !tooltipState.visible &&
          !tooltipState.displayPending &&
          !exiting
        }
        initial={{ opacity: 0 }}
      >
        <IconButton
          p={0}
          position={'absolute'}
          right={0}
          top={-44}
          alignSelf={'flex-end'}
          onPress={() => {
            setTooltipState((prevState) => ({
              ...prevState,
              visible: true,
              clicked: true,
              displayPending: false,
            }));
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
      <View w={'100%'} {...restProps}>
        {React.createElement(currentQuestion!.surveyAction!, {
          runner: runner,
          question: currentQuestion,
          openTooltip: () => {
            setTooltipState((prevState) => ({
              ...prevState,
              visible: true,
              clicked: true,
              displayPending: false,
            }));
          },
          closeTooltip: () => {
            setTooltipState((prevState) => ({
              ...prevState,
              visible: false,
            }));
          },
          onSubmit: async (value: any, message: any) => {
            await hideComponent(() => {
              runner.setAnswer(
                currentQuestion?.dataKey ?? currentQuestion?.key,
                value,
                message,
              );
            });
            return runner.next(true);
          },
        })}
      </View>
    );

    const contentElement = (
      <VStack ref={contentRef}>
        {tooltipTriggerElement}
        <GrowingComponent
          key={currentQuestion?.key}
          component={actionElement}
          exiting={exiting}
          containerStyle={{
            width: '100%',
          }}
          componentWrapperStyle={{
            width: '100%',
          }}
          componentStyle={{
            width: '100%',
          }}
        />
      </VStack>
    );

    return (
      <ControlledTooltip
        targetRef={contentRef}
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
