import { TimePickerThemeProvider } from '@artsiombarouski/rn-form';
import { DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React from 'react';
import { Platform } from 'react-native';
import {
  DefaultTheme as PaperDefaultTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const theme = extendTheme({
  colors: {
    primary: {
      50: '#e2f8fb',
      100: '#c7e1e8',
      200: '#a8ccd5',
      300: '#89b8c3',
      400: '#69a3b1',
      500: '#508a97',
      600: '#3c6b76', // PRIMARY
      700: '#294d56',
      800: '#142f35',
      900: '#001117',
    },
    danger: {
      50: '#FEF5F5', // ErrorView bg
      100: '#FCCFCF', // ErrorView border
      500: '#F26464', // border
      900: '#C53434', // remove icon
    },
    blueGray: {
      100: '#CFD6DD', // input border
      200: '#E9ECEF', // selectedTab
      300: '#F0F3F5', // teams badge
      400: '#7E8B99', // optional text
      500: '#9EA8B3', // empty project text
      600: '#555F6D', // tab badges
      700: '#4A545E', // inactive header item
      800: '#272E35', // heading
    },
    blue: {
      300: '#EDF2FF', // Calendar range background
      500: '#3062D4', // Calendar selected
    },
  },
  components: {
    Calendar: {
      defaultProps: {
        colorScheme: 'secondary',
      },
    },
    MenuItem: {
      baseStyle: {
        _stack: {
          width: '100%',
        },
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: '50%',
      },
    },
  },
  fontConfig: {
    Inter: {
      400: 'Inter-Regular',
      500: 'Inter-Medium',
      600: 'Inter-SemiBold',
      700: 'Inter-Bold',
    },
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
});

export const AppThemeProvider = (props: { children: any }) => {
  if (Platform.OS === 'web') {
    document.getElementById('root')!.style.height = '100vh';
  }

  return (
    <PaperProvider theme={PaperDefaultTheme}>
      <TimePickerThemeProvider
        theme={{
          ...MD3LightTheme,
          colors: {
            ...MD3LightTheme.colors,
            primary: theme.colors.secondary[200],
            primaryContainer: theme.colors.secondary[200],
            onPrimary: theme.colors.blueGray[800],
            onPrimaryContainer: theme.colors.blueGray[800],
            surface: theme.colors.blueGray[300],
            onSurface: theme.colors.blueGray[800],
            surfaceVariant: theme.colors.secondary[100],
            secondaryContainer: theme.colors.secondary[400],
          },
        }}
      >
        <ThemeProvider value={navigationTheme}>
          <NativeBaseProvider theme={theme}>
            {props.children}
          </NativeBaseProvider>
        </ThemeProvider>
      </TimePickerThemeProvider>
    </PaperProvider>
  );
};
