import XDate from 'xdate';

const latinNumbersPattern = /[0-9]/g;
export function getFontString(fontFamily: string, fontWeight: string): string {
  return `${fontFamily}-${fontWeight}`;
}

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
