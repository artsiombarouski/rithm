import { CalendarArrow } from './CalendarArrow';
import CalendarHeader from './CalendarHeader';
import YearPicker from './YearPicker';
import type {
  CalendarProps,
  CalendarTheme,
  MultiDates,
  RangeDates,
  SingleDate,
} from './types';
import { SelectionType } from './types';
import { determineInitialLeftDate, getFontFamilyByWeight } from './utils';
import dayjs from 'dayjs';
import { useTheme } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Calendar as BaseCalendar, DateData } from 'react-native-calendars';
import { MarkingTypes, MarkedDates } from 'react-native-calendars/src/types';

export const Calendar = (props: CalendarProps) => {
  const {
    selectionType,
    value,
    fallbackValue,
    onChange,
    containerStyle,
    arrowProps,
    mode = 'dual',
    useNavigationToCurrentMonth = false,
    selectedColor,
    onDayChanged,
    selectYearFirst = false,
    ...calendarProps
  } = props;
  const { markingType, ...restCalendarProps } = calendarProps;
  const theme = useTheme();
  const colorScheme =
    selectedColor ??
    // @ts-ignore
    theme.components.Calendar?.defaultProps?.colorScheme ??
    'primary';

  const leftArrowMonthShift = mode === 'dual' ? -2 : -1;
  const rightArrowMonthShift = mode === 'dual' ? 2 : 1;

  const initialLeftDate = !useNavigationToCurrentMonth
    ? determineInitialLeftDate(selectionType, value, fallbackValue)
    : dayjs();
  const [leftDate, setLeftDate] = useState(initialLeftDate);
  const [rightDate, setRightDate] = useState(initialLeftDate.add(1, 'month'));

  const [selectingYear, setSelectingYear] = useState<boolean>(selectYearFirst);

  const onPressYear = useCallback(
    (newYear: number) => {
      setLeftDate((current) => dayjs(current).year(newYear));
      setRightDate((current) => {
        if (current.month() === 0) {
          return dayjs(current).year(newYear + 1);
        }
        return dayjs(current).year(newYear);
      });

      // Update the currently selected date based on the new year
      switch (selectionType) {
        case SelectionType.SINGLE:
          const oldSingleDate = dayjs((value as SingleDate)?.date);
          const newSingleDate = oldSingleDate
            .year(newYear)
            .format('YYYY-MM-DD');
          onChange({ date: newSingleDate });
          break;

        case SelectionType.MULTI:
          const oldMultiDates = (value as MultiDates)?.dates;
          const newMultiDates = oldMultiDates?.map((date) =>
            dayjs(date).year(newYear).format('YYYY-MM-DD'),
          );
          onChange({ dates: newMultiDates });
          break;

        case SelectionType.RANGE:
          const { startDate, endDate } = (value as RangeDates) ?? {};
          const newStartDate = startDate
            ? dayjs(startDate).year(newYear).format('YYYY-MM-DD')
            : null;
          const newEndDate = endDate
            ? dayjs(endDate).year(newYear).format('YYYY-MM-DD')
            : null;
          onChange({ startDate: newStartDate, endDate: newEndDate });
          break;
      }

      setSelectingYear((prev) => !prev);
    },
    [selectionType, setSelectingYear, value],
  );

  const generatedMarkedDates = useMemo((): MarkedDates => {
    let dates: MarkedDates = {};

    switch (selectionType) {
      case SelectionType.SINGLE:
        const date = (value as SingleDate).date;

        if (date) {
          dates[date] = {
            selected: true,
            selectedColor: theme.colors[colorScheme]['500'],
            customStyles: {
              container: {
                borderRadius: 17,
              },
            },
          };
        }
        break;
      case SelectionType.MULTI:
        (value as MultiDates).dates?.forEach((date) => {
          dates[date] = {
            selected: true,
            selectedColor: theme.colors[colorScheme]['500'],
            customStyles: {
              container: {
                borderRadius: 17,
              },
            },
          };
        });
        break;
      case SelectionType.RANGE:
        const { startDate, endDate } = (value as RangeDates) ?? {};
        if (startDate && endDate) {
          let start = dayjs(startDate);
          let end = dayjs(endDate);

          for (let d = dayjs(start); d.isBefore(end); d = d.add(1, 'day')) {
            dates[d.format('YYYY-MM-DD')] = {
              selected: false,
              color: theme.colors[colorScheme]['300'],
            };
          }

          // Mark start and end dates
          dates[start.format('YYYY-MM-DD')] = {
            ...dates[start.format('YYYY-MM-DD')],
            color: theme.colors[colorScheme]['500'],
            textColor: 'white',
            selected: true,
            startingDay: true,
          };
          dates[end.format('YYYY-MM-DD')] = {
            ...dates[end.format('YYYY-MM-DD')],
            color: theme.colors[colorScheme]['500'],
            textColor: 'white',
            selected: true,
            endingDay: true,
          };
        } else if (startDate) {
          dates[startDate] = {
            textColor: 'white',
            color: theme.colors[colorScheme]['500'],
            selected: true,
            startingDay: true,
          };
        }
        break;
    }
    return dates;
  }, [selectionType, value]);

  const handleDayPress = useCallback(
    (direction: 'right' | 'left') => (day: DateData) => {
      const selectedMonth = day.month - 1; //dayjs shows months from 0
      const targetMonth =
        direction === 'left' ? leftDate.month() : rightDate.month();

      if (selectedMonth !== targetMonth) {
        const adjustment = selectedMonth < targetMonth ? -1 : 1;
        setLeftDate((current) => dayjs(current).add(adjustment, 'month'));
        setRightDate((current) => dayjs(current).add(adjustment, 'month'));
      }

      switch (selectionType) {
        case SelectionType.SINGLE:
          onChange({ date: day.dateString });
          break;
        case SelectionType.MULTI:
          let newDates = (value as MultiDates)?.dates || [];
          const index = newDates.indexOf(day.dateString);

          if (index >= 0) {
            newDates = newDates.filter((date) => date !== day.dateString);
          } else {
            newDates = [...newDates, day.dateString];
          }
          newDates.sort();
          onChange({ dates: newDates });
          break;
        case SelectionType.RANGE:
          let { startDate, endDate } = (value as RangeDates) ?? {};
          if (startDate && endDate) {
            startDate = day.dateString;
            endDate = null;
          } else if (!startDate || day.dateString < startDate) {
            endDate = startDate;
            startDate = day.dateString;
          } else if (!endDate || day.dateString >= startDate) {
            endDate = day.dateString;
          }
          onChange({ startDate, endDate });
          break;
      }
      onDayChanged?.();
    },
    [leftDate, rightDate, selectionType, value, onDayChanged],
  );

  const generateArrow = useCallback(
    (calendar: 'left' | 'right') => (direction: 'left' | 'right') => {
      if (direction !== calendar && mode === 'dual')
        //for centering month
        return (
          <CalendarArrow
            disabled={true}
            opacity={0}
            direction={direction}
            onPress={null}
            {...arrowProps}
          />
        );
      const moveMonths =
        calendar === 'left' ? leftArrowMonthShift : rightArrowMonthShift;

      const onArrowPress = () => {
        if (mode === 'dual') {
          setLeftDate((current) => dayjs(current).add(moveMonths, 'month'));
          setRightDate((current) => dayjs(current).add(moveMonths, 'month'));
        } else {
          setLeftDate((current) =>
            dayjs(current).add(
              direction === 'left' ? leftArrowMonthShift : rightArrowMonthShift,
              'month',
            ),
          );
        }
      };

      return (
        <CalendarArrow
          direction={direction}
          onPress={onArrowPress}
          colorScheme={colorScheme}
          {...arrowProps}
        />
      );
    },
    [leftDate, rightDate, mode, colorScheme],
  );

  const getMarkingType = (selectionType: SelectionType): MarkingTypes => {
    switch (selectionType) {
      case SelectionType.SINGLE:
        return 'custom';
      case SelectionType.MULTI:
        return 'custom';
      case SelectionType.RANGE:
        return 'period';
      default:
        return 'dot';
    }
  };

  const calendarStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    // { flex: 1, width: '100%' },
    restCalendarProps?.style,
  ]);

  const fontName = theme.fonts.body;
  const fontConfig = theme.fontConfig;

  const calendarTheme: CalendarTheme = {
    textDayFontFamily: getFontFamilyByWeight(fontName, '500', fontConfig),
    textDayFontSize: 14,
    textDayHeaderFontFamily: getFontFamilyByWeight(fontName, '500', fontConfig),
    textDayHeaderFontSize: 12,
    textMonthFontFamily: getFontFamilyByWeight(fontName, '500', fontConfig),
    textMonthFontSize: 16,
    monthTextColor: theme.colors.blueGray[700],
    dayTextColor: theme.colors.blueGray[800],
    'stylesheet.calendar.header': {
      header: styles.header,
      arrow: styles.arrow,
    },
    'stylesheet.calendar.main': {
      week: styles.week,
    },
    'stylesheet.day.period': {
      todayText: {
        fontWeight: '600',
        color: theme.colors[colorScheme][500],
      },
      base: styles.day,
    },
    'stylesheet.day.basic': {
      todayText: {
        fontWeight: '600',
        color: theme.colors[colorScheme][500],
      },
      base: styles.day,
    },
  };

  const getSharedCalendarProps = useMemo(
    () => (direction: 'right' | 'left') => {
      const arrowDisabled = mode === 'dual';
      return {
        markingType: markingType || getMarkingType(selectionType),
        initialDate:
          direction === 'left'
            ? leftDate.format('YYYY-MM-DD')
            : rightDate.format('YYYY-MM-DD'),
        onDayPress: handleDayPress(direction),
        markedDates: generatedMarkedDates,
        ...(direction === 'left'
          ? { disableArrowRight: arrowDisabled }
          : { disableArrowLeft: arrowDisabled }),
        renderArrow: generateArrow(direction),
        ...restCalendarProps,
      };
    },
    [
      markingType,
      selectionType,
      leftDate,
      rightDate,
      mode,
      generatedMarkedDates,
      restCalendarProps,
    ],
  );

  const selectedYear = leftDate.year();
  const startYear = props?.minDate ? dayjs(props.minDate).year() : 1950;
  const endYear = props?.maxDate ? dayjs(props.maxDate).year() : 2050;
  const _renderHeader = (props) => (
    <CalendarHeader
      mode={mode}
      onPressHeader={() => setSelectingYear(!selectingYear)}
      selectingYear={selectingYear}
      colorScheme={colorScheme}
      {...props}
    />
  );

  const renderCalendar = (direction: 'left' | 'right') => {
    return (
      <View style={{ flex: 1 }}>
        <BaseCalendar
          {...getSharedCalendarProps(direction)}
          style={calendarStyle}
          theme={calendarTheme}
          hideExtraDays={true}
          customHeader={_renderHeader}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderCalendar('left')}
      {mode === 'dual' && renderCalendar('right')}
      <YearPicker
        selectedYear={selectedYear}
        selectingYear={selectingYear}
        onPressYear={onPressYear}
        startYear={startYear}
        endYear={endYear}
        colorScheme={colorScheme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    alignItems: 'center',
  },
  arrow: {},
  week: {
    marginVertical: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  day: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
  },
});
