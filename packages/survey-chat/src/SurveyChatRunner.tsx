import { action, makeObservable, observable } from 'mobx';
import { SurveyMessage, SurveyQuestion } from './types';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

export type SurveyChatRunnerOptions = {
  showDelay?: number;
  actionShowDelay?: number;
  firstMessageDelay?: number;
};

export class SurveyChatRunner {
  @observable
  isInitialized: boolean = false;
  @observable
  messages: SurveyMessage[] = [];
  @observable
  currentQuestion?: SurveyQuestion | undefined;
  @observable
  canShowAction: boolean = false;
  @observable
  answers: { [key: string]: any } = {};
  @observable
  isCompleted: boolean = false;
  @observable
  canShowTypingIndicator: boolean = false;

  constructor(
    readonly questions: SurveyQuestion[],
    readonly options: SurveyChatRunnerOptions = {},
  ) {
    makeObservable(this);
  }

  @action.bound
  async init() {
    if (this.isInitialized) {
      return;
    }
    this.isInitialized = true;
    this.next().then((ignore) => {});
  }

  @action
  setAnswer(path: string, answer: any, message?: string) {
    _.set(this.answers, path, answer);
    if (message) {
      this.messages.push({
        key: `${uuidv4()}`,
        message: message,
        isAnswer: true,
      });
    }
  }

  @action.bound
  async next() {
    const indexOfCurrentQuestion = this.questions.findIndex(
      (e) => e.key === this.currentQuestion?.key,
    );
    if (!this.currentQuestion && this.options.firstMessageDelay) {
      this.canShowTypingIndicator = true;
      await this.timeout(this.options.firstMessageDelay);
    }
    this.currentQuestion = null;
    if (this.canShowAction) {
      await this.timeout(200);
      this.canShowAction = false;
    }
    if (indexOfCurrentQuestion + 1 >= this.questions.length) {
      this.isCompleted = true;
      return;
    }
    const nextQuestion = this.questions[indexOfCurrentQuestion + 1];
    this.canShowTypingIndicator = true;
    await this.timeout(
      nextQuestion.showDelay ?? this.options.showDelay ?? 1000,
    );
    this.currentQuestion = nextQuestion;
    this.messages.push({ ...nextQuestion });

    if (!nextQuestion.surveyAction) {
      this.next().then((ignore) => {});
    } else {
      this.canShowTypingIndicator = false;
      if (nextQuestion.surveyAction) {
        await this.timeout(this.options.actionShowDelay ?? 400);
        this.canShowAction = true;
      }
    }
  }

  private timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }
}
