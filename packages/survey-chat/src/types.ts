import React from 'react';
import { SurveyChatRunner } from './SurveyChatRunner';
import { SurveyChatMessageStylingProps } from './SurveyChatMessage';

export type SurveyActionProps = {
  runner: SurveyChatRunner;
  question: SurveyQuestion;
  openTooltip: () => void;
  closeTooltip: () => void;
  onSubmit: (value: any, message?: string) => void;
};

export type SurveyTooltipProps = {
  runner: SurveyChatRunner;
  question: SurveyQuestion;
  close: () => void;
};

export type SurveyMessage = {
  key: string;
  dataKey?: string;
  message?: string | ((runner: SurveyChatRunner) => string | React.ReactNode);
  messageStylingProps?: SurveyChatMessageStylingProps;
  isAnswer?: boolean;
};

export type SurveyQuestionAction = (
  props: SurveyActionProps,
) => React.ReactElement;

export type SurveyQuestion = {
  key: string;
  dataKey?: string;
  message?: string | ((runner: SurveyChatRunner) => string | React.ReactNode);
  messageStylingProps?: SurveyChatMessageStylingProps;
  isAnswer?: boolean;
  tooltip?: (props: SurveyTooltipProps) => React.ReactNode;
  tooltipInitialVisible?: boolean;
  surveyAction?: SurveyQuestionAction;
  showDelay?: number;
};
