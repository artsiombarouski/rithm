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

export type FormItemProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  title?: string;
  rules?: ControllerProps['rules'];
};

export type FormInstance<TFieldValues extends FieldValues = FieldValues> =
  UseFormReturn<TFieldValues>;

export type FormElementRenderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
};
