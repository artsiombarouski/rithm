import React from 'react';
import { FormItemProps } from '@artsiombarouski/rn-form';

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

export type PageBuilderElement<PayloadType extends PageBuilderElementPayload> =
  {
    type: string;
    title: string;
    icon: React.ComponentType<any>;
    edit: React.ComponentType<PageBuilderElementEditProps>;
    view: React.ComponentType<PageBuilderElementViewProps<PayloadType>>;
  };
