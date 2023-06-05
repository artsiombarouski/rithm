import { FormElementRenderProps, FormItemProps } from '../types';
import { FormError } from './FormError';
import { FormHelper } from './FormHelper';
import { FormTitle } from './FormTitle';
import { FormControl } from 'native-base';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
  const {
    name,
    title,
    helperText,
    rules,
    itemContainerStyle,
    render,
    ...restProps
  } = props;

  const renderElement = (renderProps: FormElementRenderProps) => {
    //todo: add FormControl props
    return (
      <FormControl
        isInvalid={!!renderProps.fieldState?.error}
        isRequired={props.rules?.required === true}
        style={itemContainerStyle}
      >
        {title && <FormTitle title={title} />}
        {render(restProps as any, renderProps)}
        <FormHelper helperText={helperText} />
        <FormError error={renderProps.fieldState?.error} />
      </FormControl>
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
