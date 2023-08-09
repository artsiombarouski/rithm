import type {
  ArrowProps,
  CalendarProps,
  CalendarTheme,
  MarkedDates,
  MultiDates,
  RangeDates,
  SingleDate,
} from './types';
import { SelectionType } from './types';
import { getFontString } from './utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { Icon, IconButton, useTheme } from 'native-base';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Calendar as BaseCalendar, DateData } from 'react-native-calendars';
import { MarkingTypes } from 'react-native-calendars/src/types';

const Arrow = ({ direction, onPress, ...props }: ArrowProps) => {
  return (
    <IconButton
      onPress={onPress}
      p={'6px'}
      icon={
        <Icon
          as={MaterialCommunityIcons}
          name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
          color={'blueGray.700'}
        />
      }
      {...props}
    />
  );
};

export const Calendar = (props: CalendarProps) => {
  const {
    selectionType,
    value,
    onChange,
    containerStyle,
    arrowProps,
    mode = 'dual',
    ...calendarProps
  } = props;
  const { markingType, ...restCalendarProps } = calendarProps;
  const theme = useTheme();

  const leftArrowMonthShift = mode === 'dual' ? -2 : -1;
  const rightArrowMonthShift = mode === 'dual' ? 2 : 1;

  const [leftDate, setLeftDate] = useState(dayjs());
  const [rightDate, setRightDate] = useState(dayjs().add(1, 'month'));

  const generatedMarkedDates = useMemo((): MarkedDates => {
    let dates: MarkedDates = {};

    switch (selectionType) {
      case SelectionType.SINGLE:
        const date = (value as SingleDate).date;

        if (date) {
          dates[date] = {
            selected: true,
            color: 'green',
          };
        }
        break;
      case SelectionType.MULTI:
        (value as MultiDates).dates?.forEach((date) => {
          dates[date] = {
            selected: true,
            color: 'green',
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
              color: theme.colors.blue['300'],
            };
          }

          // Mark start and end dates
          dates[start.format('YYYY-MM-DD')] = {
            ...dates[start.format('YYYY-MM-DD')],
            color: theme.colors.blue['500'],
            textColor: 'white',
            selected: true,
            startingDay: true,
          };
          dates[end.format('YYYY-MM-DD')] = {
            ...dates[end.format('YYYY-MM-DD')],
            color: theme.colors.blue['500'],
            textColor: 'white',
            selected: true,
            endingDay: true,
          };
        } else if (startDate) {
          dates[startDate] = {
            textColor: 'white',
            color: theme.colors.blue['500'],
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
    },
    [leftDate, rightDate, selectionType, value],
  );

  const generateArrow = useCallback(
    (calendar: 'left' | 'right') => (direction: 'left' | 'right') => {
      if (direction !== calendar && mode === 'dual')
        //for centering month
        return (
          <Arrow
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
        <Arrow direction={direction} onPress={onArrowPress} {...arrowProps} />
      );
    },
    [leftDate, rightDate, mode],
  );

  const getMarkingType = (selectionType: SelectionType): MarkingTypes => {
    switch (selectionType) {
      case SelectionType.SINGLE:
        return 'dot';
      case SelectionType.MULTI:
        return 'multi-dot';
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

  const calendarTheme: CalendarTheme = {
    textDayFontFamily: getFontString(theme.fonts.body, 'Medium'),
    textDayFontSize: 14,
    textDayHeaderFontFamily: getFontString(theme.fonts.body, 'Medium'),
    textDayHeaderFontSize: 12,
    textMonthFontFamily: getFontString(theme.fonts.body, 'Medium'),
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
        color: theme.colors.blue[500],
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

  const renderCalendar = (direction: 'left' | 'right') => {
    return (
      <View style={{ flex: 1 }}>
        <BaseCalendar
          {...getSharedCalendarProps(direction)}
          style={calendarStyle}
          theme={calendarTheme}
          hideExtraDays={true}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderCalendar('left')}
      {mode === 'dual' && renderCalendar('right')}
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
    maxWidth: 34,
    width: '100%',
  },
});
