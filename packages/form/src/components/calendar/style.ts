import * as defaultStyle from './style-constants';
import { StyleSheet, Platform } from 'react-native';
import { Theme } from 'react-native-calendars/src/types';

export default function (theme: Theme = {}) {
  const appStyle = { ...defaultStyle, ...theme };

  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 10,
      paddingRight: 10,
      marginTop: 6,
      alignItems: 'center',
    },
    partialHeader: {
      paddingHorizontal: 15,
    },
    headerContainer: {
      flexDirection: 'row',
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor,
      margin: 10,
      marginRight: 4,
    },
    arrow: {
      padding: 10,
      ...appStyle.arrowStyle,
    },
    arrowImage: {
      tintColor: appStyle.arrowColor,
      ...Platform.select({
        web: {
          width: appStyle.arrowWidth,
          height: appStyle.arrowHeight,
        },
      }),
    },
    disabledArrowImage: {
      tintColor: appStyle.disabledArrowColor,
    },
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    partialWeek: {
      paddingRight: 0,
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.textSectionTitleColor,
    },
    disabledDayHeader: {
      color: appStyle.textSectionTitleDisabledColor,
    },
    ...(theme['stylesheet.calendar.header'] || {}),
  });
}
