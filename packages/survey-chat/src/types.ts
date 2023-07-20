import React from 'react';
import { SurveyChatRunner } from './SurveyChatRunner';

export type SurveyActionProps = {
  runner: SurveyChatRunner;
  question: SurveyQuestion;
  onSubmit: (value: any, message?: string) => void;
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
  surveyAction?: (props: SurveyActionProps) => React.ReactNode;
  showDelay?: number;
};
