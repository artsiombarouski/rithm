import { Calendar, CalendarProps, FormItem } from '../components';
import { FormElementRenderProps, FormItemProps } from '../types';
import { FieldValues } from 'react-hook-form';

export type FormDualCalendarProps<T extends FieldValues = FieldValues> =
  FormItemProps<T> & Omit<CalendarProps, 'value' | 'onChange'>;

export const FormCalendar = (props: FormDualCalendarProps) => {
  const renderCalendar = (
    props: CalendarProps,
    renderProps: FormElementRenderProps,
  ) => {
    return (
      <Calendar
        {...props}
        //{...renderProps.field}
        value={renderProps.field.value}
        onChange={renderProps.field.onChange}
      />
    );
  };

  return <FormItem<CalendarProps> {...props} render={renderCalendar} />;
};
