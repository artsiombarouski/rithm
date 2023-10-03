import { ArrowTopIcon } from '../../assets';
import styleConstructor from './style';
import { weekDayNames, formatNumbers } from './utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import includes from 'lodash/includes';
import { Icon, IconButton, Pressable, Row } from 'native-base';
import React, {
  ReactNode,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  ActivityIndicator,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  AccessibilityActionEvent,
  ColorValue,
  Insets,
} from 'react-native';
import { Theme, Direction } from 'react-native-calendars/src/types';
import XDate from 'xdate';

export interface CalendarHeaderProps {
  month?: XDate;
  addMonth?: (num: number) => void;

  /** Specify theme properties to override specific styles for calendar parts */
  theme?: Theme;
  /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday */
  firstDay?: number;
  /** Display loading indicator. Default = false */
  displayLoadingIndicator?: boolean;
  /** Show week numbers. Default = false */
  showWeekNumbers?: boolean;
  /** Month format in the title. Formatting values: http://arshaw.com/xdate/#Formatting */
  monthFormat?: string;
  /** Hide day names */
  hideDayNames?: boolean;
  /** Hide month navigation arrows */
  hideArrows?: boolean;
  /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
  renderArrow?: (direction: Direction) => ReactNode;
  /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
  onPressArrowLeft?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
  onPressArrowRight?: (method: () => void, month?: XDate) => void; //TODO: replace with string
  /** Left & Right arrows. Additional distance outside of the buttons in which a press is detected, default: 20 */
  arrowsHitSlop?: Insets | number;
  /** Disable left arrow */
  disableArrowLeft?: boolean;
  /** Disable right arrow */
  disableArrowRight?: boolean;
  /** Apply custom disable color to selected day names indexes */
  disabledDaysIndexes?: number[];
  /** Replace default title with custom one. the function receive a date as parameter */
  renderHeader?: (date?: XDate) => ReactNode; //TODO: replace with string
  /** Replace default title with custom element */
  customHeaderTitle?: JSX.Element;

  /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
  webAriaLevel?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityElementsHidden?: boolean;
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  /** The number of days to present in the header */
  numberOfDays?: number;
  /** The current date presented */
  current?: string;
  /** Left inset for the timeline calendar header, default is 72 */
  timelineLeftInset?: number;
  mode?: 'single' | 'dual';
  onPressHeader?: () => void;
  selectingYear?: boolean;
  colorScheme: string;
}

const accessibilityActions = [
  { name: 'increment', label: 'increment' },
  { name: 'decrement', label: 'decrement' },
];

const CalendarHeader = forwardRef((props: CalendarHeaderProps, ref) => {
  const {
    theme,
    style: propsStyle,
    addMonth: propsAddMonth,
    month,
    monthFormat,
    firstDay,
    hideDayNames,
    showWeekNumbers,
    hideArrows,
    renderArrow,
    onPressArrowLeft,
    onPressArrowRight,
    arrowsHitSlop = 20,
    disableArrowLeft,
    disableArrowRight,
    disabledDaysIndexes,
    displayLoadingIndicator,
    customHeaderTitle,
    renderHeader,
    webAriaLevel,
    testID,
    accessibilityElementsHidden,
    importantForAccessibility,
    numberOfDays,
    current = '',
    timelineLeftInset,
    mode = 'single',
    onPressHeader,
    selectingYear = false,
    colorScheme,
  } = props;

  const numberOfDaysCondition = useMemo(() => {
    return numberOfDays && numberOfDays > 1;
  }, [numberOfDays]);
  const style = useRef(styleConstructor(theme));
  const headerStyle = useMemo(() => {
    return [
      style.current.header,
      numberOfDaysCondition ? style.current.partialHeader : undefined,
    ];
  }, [numberOfDaysCondition]);
  const partialWeekStyle = useMemo(() => {
    return [style.current.partialWeek, { paddingLeft: timelineLeftInset }];
  }, [timelineLeftInset]);
  const dayNamesStyle = useMemo(() => {
    return [
      style.current.week,
      numberOfDaysCondition ? partialWeekStyle : undefined,
    ];
  }, [numberOfDaysCondition, partialWeekStyle]);
  const hitSlop: Insets | undefined = useMemo(
    () =>
      typeof arrowsHitSlop === 'number'
        ? {
            top: arrowsHitSlop,
            left: arrowsHitSlop,
            bottom: arrowsHitSlop,
            right: arrowsHitSlop,
          }
        : arrowsHitSlop,
    [arrowsHitSlop],
  );

  useImperativeHandle(ref, () => ({
    onPressLeft,
    onPressRight,
  }));

  const addMonth = useCallback(() => {
    propsAddMonth?.(1);
  }, [propsAddMonth]);

  const subtractMonth = useCallback(() => {
    propsAddMonth?.(-1);
  }, [propsAddMonth]);

  const onPressLeft = useCallback(() => {
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(subtractMonth, month);
    }
    return subtractMonth();
  }, [onPressArrowLeft, subtractMonth, month]);

  const onPressRight = useCallback(() => {
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(addMonth, month);
    }
    return addMonth();
  }, [onPressArrowRight, addMonth, month]);

  const onAccessibilityAction = useCallback(
    (event: AccessibilityActionEvent) => {
      switch (event.nativeEvent.actionName) {
        case 'decrement':
          onPressLeft();
          break;
        case 'increment':
          onPressRight();
          break;
        default:
          break;
      }
    },
    [onPressLeft, onPressRight],
  );

  const renderWeekDays = useMemo(() => {
    const dayOfTheWeek = new XDate(current).getDay();
    const weekDaysNames = numberOfDaysCondition
      ? weekDayNames(dayOfTheWeek)
      : weekDayNames(firstDay);
    const dayNames = numberOfDaysCondition
      ? weekDaysNames.slice(0, numberOfDays)
      : weekDaysNames;

    return dayNames.map((day: string, index: number) => {
      const dayStyle = [style.current.dayHeader];

      if (includes(disabledDaysIndexes, index)) {
        dayStyle.push(style.current.disabledDayHeader);
      }

      const dayTextAtIndex = `dayTextAtIndex${index}`;
      if (style.current[dayTextAtIndex]) {
        dayStyle.push(style.current[dayTextAtIndex]);
      }

      return (
        <Text
          allowFontScaling={false}
          key={index}
          style={dayStyle}
          numberOfLines={1}
          accessibilityLabel={''}
        >
          {day}
        </Text>
      );
    });
  }, [
    firstDay,
    current,
    numberOfDaysCondition,
    numberOfDays,
    disabledDaysIndexes,
  ]);

  const _renderHeader = () => {
    const webProps =
      Platform.OS === 'web' ? { 'aria-level': webAriaLevel } : {};

    if (renderHeader) {
      return renderHeader(month);
    }

    if (customHeaderTitle) {
      return customHeaderTitle;
    }

    return (
      <Pressable onPress={() => onPressHeader?.()}>
        <Row alignItems={'center'}>
          <Text
            allowFontScaling={false}
            style={style.current.monthText}
            testID={`${testID}.title`}
            {...webProps}
          >
            {formatNumbers(month?.toString(monthFormat))}
          </Text>
          <IconButton
            onPress={() => onPressHeader?.()}
            p={'6px'}
            icon={
              <ArrowTopIcon
                style={{
                  transform: [{ rotate: `${selectingYear ? 0 : 180}deg` }],
                }}
                size={5}
                color={'blueGray.700'}
              />
            }
            colorScheme={colorScheme}
          />
        </Row>
      </Pressable>
    );
  };

  const _renderArrow = (direction: Direction) => {
    if (hideArrows) {
      return <View />;
    }

    const isLeft = direction === 'left';
    const arrowId = isLeft ? 'leftArrow' : 'rightArrow';
    const shouldDisable = isLeft ? disableArrowLeft : disableArrowRight;
    const onPress = !shouldDisable
      ? isLeft
        ? onPressLeft
        : onPressRight
      : undefined;
    const iconName = isLeft ? 'chevron-left' : 'chevron-right';
    const renderArrowDirection = isLeft ? 'left' : 'right';
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={shouldDisable}
        style={style.current.arrow}
        hitSlop={hitSlop}
        testID={`${testID}.${arrowId}`}
      >
        {renderArrow ? (
          renderArrow(renderArrowDirection)
        ) : (
          <Icon
            as={MaterialCommunityIcons} //todo: remove if flickers
            name={iconName}
            color={'blueGray.700'}
            style={
              shouldDisable
                ? style.current.disabledArrowImage
                : style.current.arrowImage
            }
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderIndicator = () => {
    if (displayLoadingIndicator) {
      return (
        <ActivityIndicator
          color={theme?.indicatorColor as ColorValue}
          testID={`${testID}.loader`}
        />
      );
    }
  };

  const renderWeekNumbersSpace = () => {
    return showWeekNumbers && <View style={style.current.dayHeader} />;
  };

  const renderDayNames = () => {
    if (!hideDayNames) {
      return (
        <View style={dayNamesStyle} testID={`${testID}.dayNames`}>
          {renderWeekNumbersSpace()}
          {renderWeekDays}
        </View>
      );
    }
  };

  return (
    <View
      testID={testID}
      style={propsStyle}
      accessible
      accessibilityRole={'adjustable'}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      accessibilityElementsHidden={accessibilityElementsHidden} // iOS
      importantForAccessibility={importantForAccessibility} // Android
    >
      <View style={headerStyle}>
        {mode === 'single' ? (
          <>
            <View style={style.current.headerContainer}>
              {_renderHeader()}
              {renderIndicator()}
            </View>
            <Row>
              {_renderArrow('left')}
              {_renderArrow('right')}
            </Row>
          </>
        ) : (
          <>
            {_renderArrow('left')}
            <View style={style.current.headerContainer}>
              {_renderHeader()}
              {renderIndicator()}
            </View>
            {_renderArrow('right')}
          </>
        )}
      </View>
      {renderDayNames()}
    </View>
  );
});

export default CalendarHeader;
CalendarHeader.displayName = 'CalendarHeader';
CalendarHeader.defaultProps = {
  monthFormat: 'MMMM yyyy',
  webAriaLevel: 1,
  arrowsHitSlop: 20,
};
