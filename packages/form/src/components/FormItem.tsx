import { FormElementRenderProps, FormItemProps } from '../types';
import { Controller, useFormContext } from 'react-hook-form';
import { FormTitle } from './FormTitle';
import { FormError } from './FormError';
import { View } from 'react-native';
import React from 'react';

export type FormItemComponentProps<ElementProps = any> = FormItemProps & {
  render: (
    props: ElementProps,
    renderProps: FormElementRenderProps,
  ) => React.ReactElement;
};

export function FormItem<ElementProps = any>(
  props: FormItemComponentProps<ElementProps>,
) {
  const formInstance = useFormContext();
  const { name, title, rules, itemContainerStyle, render, ...restProps } =
    props;

  const renderElement = (renderProps: FormElementRenderProps) => {
    return (
      <View style={[{ alignItems: 'flex-start' }, itemContainerStyle]}>
        <FormTitle title={title} />
        {render(restProps as any, renderProps)}
        <FormError error={renderProps.fieldState.error} />
      </View>
    );
  };

  return (
    <Controller
      name={name}
      rules={rules}
      control={formInstance.control}
      render={renderElement}
    />
  );
}
