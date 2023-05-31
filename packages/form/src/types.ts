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

export type FormValues = FieldValues;

export type FormItemProps<T extends FormValues = FormValues> = {
  name: Path<T>;
  title?: string;
  rules?: ControllerProps['rules'];
  itemContainerStyle?: StyleProp<ViewStyle>;
};

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
