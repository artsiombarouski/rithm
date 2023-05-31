import type {
  ArrowProps,
  CalendarProps,
  MarkedDates,
  MultiDates,
  RangeDates,
  SingleDate,
} from './types';
import { SelectionType } from './types';
import { AntDesign } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Calendar as BaseCalendar, DateData } from 'react-native-calendars';
import { MarkingTypes } from 'react-native-calendars/src/types';

const Arrow = ({ direction, onPress, ...props }: ArrowProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <AntDesign
        name={direction === 'left' ? 'left' : 'right'}
        size={24}
        color="black"
        {...props}
      />
    </TouchableOpacity>
  );
};

export const Calendar = ({
  selectionType,
  value,
  onChange,
  containerStyle,
  arrowProps,
  mode = 'dual',
  ...calendarProps
}: CalendarProps) => {
  const { markingType, ...restCalendarProps } = calendarProps;

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
        (value as MultiDates).dates.forEach((date) => {
          dates[date] = {
            selected: true,
            color: 'green',
          };
        });
        break;
      case SelectionType.RANGE:
        const { startDate, endDate } = value as RangeDates;
        if (startDate && endDate) {
          let start = dayjs(startDate);
          let end = dayjs(endDate);

          for (let d = dayjs(start); d.isBefore(end); d = d.add(1, 'day')) {
            dates[d.format('YYYY-MM-DD')] = {
              selected: true,
              color: 'blue',
            };
          }

          // Mark start and end dates
          dates[start.format('YYYY-MM-DD')] = {
            ...dates[start.format('YYYY-MM-DD')],
            color: 'green',
            startingDay: true,
          };
          dates[end.format('YYYY-MM-DD')] = {
            ...dates[end.format('YYYY-MM-DD')],
            color: 'red',
            endingDay: true,
          };
        } else if (startDate) {
          dates[startDate] = {
            color: 'green',
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
          const newDates = [...(value as MultiDates).dates];
          const index = newDates.indexOf(day.dateString);
          if (index >= 0) {
            newDates.splice(index, 1);
          } else {
            newDates.push(day.dateString);
          }
          onChange({ dates: newDates });

          break;
        case SelectionType.RANGE:
          let { startDate, endDate } = value as RangeDates;
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
      if (direction !== calendar && mode === 'dual') return null;
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

  return (
    <View style={[styles.container, containerStyle]}>
      <BaseCalendar {...getSharedCalendarProps('left')} />
      {mode === 'dual' && <BaseCalendar {...getSharedCalendarProps('right')} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row' },
});
