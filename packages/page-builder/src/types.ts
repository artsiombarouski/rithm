import { FormItemProps } from '@artsiombarouski/rn-form';
import React from 'react';

export type PageBuilderElementPayload<ValueType = any> = {
  key: string;
  type: string;
  value?: ValueType;
};

export type PageBuilderElementEditProps = FormItemProps<any> & {};

export type PageBuilderElementViewProps<
  T extends PageBuilderElementPayload = any,
> = {
  payload: T;
};

export type PageBuilderElement<
  PayloadType extends PageBuilderElementPayload,
  EditProps extends PageBuilderElementEditProps = any,
  ViewProps extends PageBuilderElementViewProps<PayloadType> = any,
> = {
  type: string;
  title: string;
  buttonTitle: string;
  Icon: React.ComponentType<any>;
  Edit: React.ComponentType<PageBuilderElementEditProps>;
  View: React.ComponentType<ViewProps>;
};
