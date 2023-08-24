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
    Icon: React.ComponentType<any>;
    Edit: React.ComponentType<PageBuilderElementEditProps>;
    View: React.ComponentType<PageBuilderElementViewProps<PayloadType>>;
  };
