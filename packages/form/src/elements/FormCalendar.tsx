import { Calendar, CalendarProps, FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormDualCalendarProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Omit<CalendarProps, 'value' | 'onChange'> & {
      assignValues?: boolean;
    };

export const FormCalendar = (props: FormDualCalendarProps) => {
  const { assignValues, ...restProps } = props;
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

  return <FormItem<CalendarProps> {...restProps} render={renderCalendar} />;
};
