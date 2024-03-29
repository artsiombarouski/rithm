import { FormErrorProps } from './components';
import { FormHelperProps } from './components/FormHelper';
import { IFormControlLabelProps } from 'native-base/lib/typescript/components/composites/FormControl/types';
import { ReactNode } from 'react';
import {
  ControllerFieldState,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
  UseFormReturn,
  UseFormStateReturn,
} from 'react-hook-form';
import { StyleProp, ViewStyle } from 'react-native';
import {ITextProps} from "native-base";

export type FormValues = FieldValues;

export type FormTitleProps = {
  title?: string | ReactNode;
  tooltipText?: string;
  tooltipIcon?: ReactNode;
  rightLabel?: string | ReactNode;
  onRightLabelPress?: () => void;
  titleProps?: IFormControlLabelProps;
  optional?: boolean;
  optionalText?: string;
  optionalProps?: ITextProps
};

export type FormItemProps<T extends FormValues = FormValues> = {
  name: Path<T>;
  rules?: ControllerProps['rules'];
  itemContainerStyle?: StyleProp<ViewStyle>;
  keepErrorSpace?: boolean;
  showHelper?: boolean;
  showError?: boolean;
} & FormTitleProps &
  Pick<FormHelperProps, 'helperText' | 'helperProps'> &
  Omit<FormErrorProps, 'error'>;

export type FormInstance<TFieldValues extends FormValues = FormValues> =
  UseFormReturn<TFieldValues>;

export type FormElementRenderProps<
  TFieldValues extends FormValues = FormValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
};
