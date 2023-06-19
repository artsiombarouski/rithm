import { Calendar, CalendarProps, FormItem } from '../components';
import { FormElementRenderProps, FormItemProps, FormValues } from '../types';

export type FormDualCalendarProps<T extends FormValues = FormValues> =
  FormItemProps<T> & Omit<CalendarProps, 'value' | 'onChange'>;

export const FormCalendar = (props: FormDualCalendarProps) => {
  const renderCalendar = (
    props: CalendarProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <Calendar
        {...props}
        value={renderProps.field.value}
        onChange={renderProps.field.onChange}
      />
    );
  };

  return <FormItem<CalendarProps> {...props} render={renderCalendar} />;
};
