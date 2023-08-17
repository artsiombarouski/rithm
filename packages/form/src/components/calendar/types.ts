import { IIconButtonProps } from 'native-base';
import { Dispatch, SetStateAction } from 'react';
import { GestureResponderEvent, ViewStyle } from 'react-native';
import { CalendarProps as BaseCalendarProps } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';

export type ArrowProps = {
  direction: 'left' | 'right';
  onPress: (event: GestureResponderEvent) => void;
} & IIconButtonProps;

export type SingleDate = { date: string | null };
export type MultiDates = { dates: Array<string> };
export type RangeDates = { startDate: string | null; endDate: string | null };

export type SelectedDates = SingleDate | MultiDates | RangeDates;

export enum SelectionType {
  SINGLE = 'single',
  MULTI = 'multi',
  RANGE = 'range',
}

export type CalendarProps<T extends SelectedDates = SelectedDates> =
  BaseCalendarProps & {
    selectionType: SelectionType;
    containerStyle?: ViewStyle;
    arrowProps?: IIconButtonProps;
    value: T;
    onChange: Dispatch<SetStateAction<T>>;
    mode?: 'single' | 'dual';
    useNavigationToCurrentMonth?: boolean;
    selectedColor?: string;
    startYear?: number;
    endYear?: number;
  };

export type CalendarTheme = Theme & {
  'stylesheet.calendar.header'?: object;
  'stylesheet.calendar.main'?: object;
  'stylesheet.day.period'?: object;
  'stylesheet.day.basic'?: object;
};
