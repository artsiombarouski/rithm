import React from 'react';
import { SurveyChatRunner } from './SurveyChatRunner';

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
  isAnswer?: boolean;
};

export type SurveyQuestion = {
  key: string;
  dataKey?: string;
  message?: string | ((runner: SurveyChatRunner) => string);
  isAnswer?: boolean;
  tooltip?: (props: SurveyTooltipProps) => React.ReactNode;
  tooltipInitialVisible?: boolean;
  surveyAction?: (props: SurveyActionProps) => React.ReactElement;
  showDelay?: number;
};
