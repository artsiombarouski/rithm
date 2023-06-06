import { Dispatch, SetStateAction } from 'react';
import { ViewStyle } from 'react-native';
import { CalendarProps as BaseCalendarProps } from 'react-native-calendars';

export type MarkedDates = {
  [date: string]: {
    selected: boolean;
    startingDay?: boolean;
    endingDay?: boolean;
    color: string;
  };
};

type ArrowAppearanceProps = {
  size?: number;
  color?: string;
};

export type ArrowProps = {
  direction: 'left' | 'right';
  onPress: () => void;
} & ArrowAppearanceProps;

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
    arrowProps?: ArrowAppearanceProps;
    value: T;
    onChange: Dispatch<SetStateAction<T>>;
    mode?: 'single' | 'dual';
  };
