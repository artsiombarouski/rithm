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
    helperProps,
    errorProps,
    tooltipText,
    tooltipIcon,
    rightLabel,
    onRightLabelPress,
    keepErrorSpace = true,
    rules,
    itemContainerStyle,
    render,
    showHelper = true,
    showError = true,
    titleProps,
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
        {(title || rightLabel) && (
          <FormTitle
            title={title}
            tooltipText={tooltipText}
            tooltipIcon={tooltipIcon}
            rightLabel={rightLabel}
            onRightLabelPress={onRightLabelPress}
            titleProps={titleProps}
          />
        )}
        {render(restProps as any, renderProps)}
        {(helperText || keepErrorSpace) && showHelper && (
          <FormHelper helperText={helperText} {...helperProps} />
        )}
        {showError && (
          <FormError error={renderProps.fieldState?.error} {...errorProps} />
        )}
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
