import React, { createContext, useContext } from 'react';
import { MD3Theme } from 'react-native-paper';

const TimePickerThemeContext = createContext<MD3Theme | undefined>(undefined);

export const TimePickerThemeProvider = ({ theme, children }) => {
  return (
    <TimePickerThemeContext.Provider value={theme}>
      {children}
    </TimePickerThemeContext.Provider>
  );
};

export const useTimePickerTheme = () => {
  return useContext(TimePickerThemeContext);
};
