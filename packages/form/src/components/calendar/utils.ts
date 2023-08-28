import { MultiDates, RangeDates, SelectionType, SingleDate } from './types';
import dayjs from 'dayjs';
import XDate from 'xdate';

const latinNumbersPattern = /[0-9]/g;

export const getFontFamilyByWeight = (
  fontName: string,
  weight: string,
  fontConfig: any,
) => {
  const fontObject = fontConfig?.[fontName];
  if (!fontObject || !fontObject?.[weight]) return fontName; // fallback to the base font name

  if (typeof fontObject[weight] === 'string') {
    return fontObject[weight];
  }
  return fontObject[weight].normal;
};

export function getLocale() {
  return XDate.locales[XDate.defaultLocale];
}

export function formatNumbers(date: any) {
  const numbers = getLocale().numbers;
  return numbers
    ? date
        .toString()
        .replace(latinNumbersPattern, (char: any) => numbers[+char])
    : date;
}

export function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = getLocale().dayNamesShort;
  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames
      .slice(dayShift)
      .concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

export function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(null)
    .map((_, i) => start + i);
}

export const determineInitialLeftDate = (
  selectionType: SelectionType,
  value: any,
): dayjs.Dayjs => {
  switch (selectionType) {
    case SelectionType.SINGLE:
      return (value as SingleDate)?.date
        ? dayjs((value as SingleDate).date)
        : dayjs();
    case SelectionType.MULTI:
      const dates = (value as MultiDates)?.dates;
      return dates && dates.length ? dayjs(dates[0]) : dayjs();
    case SelectionType.RANGE:
      const startDate = (value as RangeDates)?.startDate;
      return startDate ? dayjs(startDate) : dayjs();
    default:
      return dayjs();
  }
};
