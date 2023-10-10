import { Text, useBreakpointValue, useTheme } from 'native-base';
import { TopTabs } from '@artsiombarouski/rn-expo-router-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  AttachStep,
  flip,
  offset,
  shift,
  SpotlightTour,
  SpotlightTourProvider,
  TourBox,
  TourStep,
} from 'react-native-spotlight-tour';
import { createRef, useEffect } from 'react';

const tourSteps: TourStep[] = [
  {
    motion: 'fade',
    render: (props) => (
      <TourBox
        title="Tour: Customization"
        backText="Previous"
        nextText="Next"
        {...props}
      >
        <Text>
          {'This is the first step of tour example.\n'}
          {'If you want to go to the next step, please press '}
          <Text bold={true}>{'Next.\n'}</Text>
          {'If you want to go to the previous step, press '}
          <Text bold={true}>{'Previous.\n'}</Text>
        </Text>
      </TourBox>
    ),
  },
  {
    render: (props) => (
      <TourBox
        title="Tour: Customization 2"
        backText="Previous"
        nextText="Next"
        {...props}
      >
        <Text>
          {'This is the first step of tour example.\n'}
          {'If you want to go to the next step, please press '}
          <Text bold={true}>{'Next.\n'}</Text>
          {'If you want to go to the previous step, press '}
          <Text bold={true}>{'Previous.\n'}</Text>
        </Text>
      </TourBox>
    ),
  },
];

export default function Layout() {
  const theme = useTheme();
  const adaptiveProps = useBreakpointValue({
    base: {
      tabBarPosition: 'top',
      screenOptions: {
        tabBarGap: 8,
        scrollEnabled: false,
        tabBarItemStyle: {
          backgroundColor: theme.colors.primary['100'],
          borderRadius: 24,
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 8,
          paddingTop: 8,
        },
      },
    },
    md: {
      tabBarPosition: 'left',
      screenOptions: {
        tabBarGap: 8,
        tabBarItemStyle: {
          backgroundColor: theme.colors.primary['100'],
          borderRadius: 24,
          paddingLeft: 8,
          paddingRight: 8,
          minHeight: 48,
        },
        tabBarActiveItemStyle: {
          backgroundColor: theme.colors.primary['300'],
        },
      },
    },
  });
  const spotlightRef = createRef<SpotlightTour>();

  useEffect(() => {
    spotlightRef.current?.start();
  }, []);

  return (
    <SpotlightTourProvider
      ref={spotlightRef}
      steps={tourSteps}
      overlayColor={'black'}
      overlayOpacity={0.5}
      shape={'rectangle'}
      motion={'slide'}
      // This configurations will apply to all steps
      floatingProps={{
        middleware: [offset(10), shift(), flip()],
        placement: 'bottom',
      }}
    >
      <TopTabs
        {...adaptiveProps}
        screenOptions={{
          tabBarGap: 24,
          tabBarIconSize: 20,
          ...adaptiveProps.screenOptions,
        }}
      >
        <TopTabs.Screen
          name={'tab1'}
          options={{
            tabBarItemWrapper: (child) => {
              return <AttachStep index={0}>{child as any}</AttachStep>;
            },
          }}
        />
        <TopTabs.Screen
          name={'tab2'}
          options={{
            tabBarLabel: 'Label with some long title',
            tabBarItemWrapper: (child) => {
              return <AttachStep index={1}>{child as any}</AttachStep>;
            },
          }}
        />
        <TopTabs.Screen
          name={'tab3'}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <Ionicons name="home" color={color} size={size} />;
            },
          }}
        />
        <TopTabs.Screen
          name={'tab4'}
          options={{ tabBarLabel: 'Label with long title' }}
        />
        <TopTabs.Screen name={'tab5'} />
        <TopTabs.Screen name={'tab6'} options={{ href: null }} />
      </TopTabs>
    </SpotlightTourProvider>
  );
}
