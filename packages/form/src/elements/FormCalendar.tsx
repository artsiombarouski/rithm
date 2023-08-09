import {
  Calendar,
  CalendarProps,
  FormItem,
  SelectionType,
} from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormDualCalendarProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<CalendarProps, 'value' | 'onChange'> & {
      assignValues?: boolean;
    };

const validateDateBySelectionType = (selectionType: SelectionType) => {
  return (value: any) => {
    switch (selectionType) {
      case SelectionType.SINGLE:
        return value.date != null || 'A date selection is required';
      case SelectionType.RANGE:
        return (
          (value.startDate != null && value.endDate != null) ||
          'A date range selection is required'
        );
      case SelectionType.MULTI:
        return (
          (value.dates &&
            Array.isArray(value.dates) &&
            value.dates.length > 0) ||
          'Multiple date selections are required'
        );
      default:
        return true;
    }
  };
};

export const FormCalendar = (props: FormDualCalendarProps) => {
  const { assignValues, rules, ...restProps } = props;

  const constructedRules = {
    ...rules,
    ...(rules?.required && {
      validate: validateDateBySelectionType(props.selectionType),
    }),
  };

  const renderCalendar = (
    props: CalendarProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <Calendar
        {...props}
        value={renderProps.field.value}
        onChange={(value) => {
          let targetValue;
          if (assignValues) {
            targetValue = { ...renderProps.field.value, ...value };
          } else {
            targetValue = value;
          }
          renderProps.field.onChange(targetValue);
        }}
      />
    );
  };

  return (
    <FormItem<CalendarProps>
      {...restProps}
      rules={constructedRules}
      render={renderCalendar}
    />
  );
};
