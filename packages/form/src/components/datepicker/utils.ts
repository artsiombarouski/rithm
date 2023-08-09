import {
  MultiDates,
  RangeDates,
  SelectedDates,
  SelectionType,
  SingleDate,
} from '../calendar';
import dayjs from 'dayjs';

export function getInputValue(
  value: SelectedDates,
  selectionType: SelectionType,
): string {
  let formattedValue = '';

  switch (selectionType) {
    case SelectionType.SINGLE:
      formattedValue = (value as SingleDate).date
        ? dayjs((value as SingleDate).date).format('MM/DD/YYYY')
        : '';
      break;

    case SelectionType.MULTI:
      const multiDatesValue = value as MultiDates;
      if (multiDatesValue.dates) {
        formattedValue = multiDatesValue.dates
          .map((date) => dayjs(date))
          .sort((a, b) => (a.isBefore(b) ? -1 : 1))
          .map((date) => date.format('MM/DD/YYYY'))
          .join(', ');
      }
      break;

    case SelectionType.RANGE:
      const rangeDatesValue = value as RangeDates;
      formattedValue = `${
        rangeDatesValue.startDate
          ? dayjs(rangeDatesValue.startDate).format('MM/DD/YYYY')
          : ''
      } - ${
        rangeDatesValue.endDate
          ? dayjs(rangeDatesValue.endDate).format('MM/DD/YYYY')
          : ''
      }`;
      break;
  }

  return formattedValue;
}
