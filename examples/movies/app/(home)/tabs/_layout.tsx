import {
  MaterialTopTabs,
  RoundedTabBarIndicator,
} from '@artsiombarouski/rn-expo-router-top-tabs';
import { AddIcon, HStack, Text, useTheme } from 'native-base';
import { StyleSheet } from 'react-native';

export default function Layout() {
  const theme = useTheme();
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.red['500'],
        tabBarInactiveTintColor: theme.colors.text['500'],
        tabBarItemStyle: {
          width: 'auto',
          padding: 0,
          margin: 0,
          minHeight: 0,
          borderWidth: 1,
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 4,
        },
        tabBarScrollEnabled: true,
        tabBarGap: 12,
        tabBarIndicatorStyle: {
          height: '100%',
          backgroundColor: theme.colors.gray['300'],
          borderRadius: 24,
        },
        tabBarLabelStyle: {
          fontSize: 16,
        },
        tabBarIndicator: ({ state, ...rest }) => {
          return (
            <RoundedTabBarIndicator
              navigationState={state}
              {...rest}
              style={StyleSheet.flatten([
                rest.style,
                {
                  borderRadius: 24,
                },
              ])}
            />
          );
        },
      }}
    >
      <MaterialTopTabs.Screen name={'tab1'} />
      <MaterialTopTabs.Screen
        name={'tab2'}
        options={{ tabBarLabel: 'Label with some long title' }}
      />
      <MaterialTopTabs.Screen
        name={'tab3'}
        options={{
          tabBarLabel: (props) => {
            return (
              <HStack alignItems={'center'} space={'xs'}>
                <AddIcon color={props.color} w={20} h={20} />
                <Text color={props.color}>Tab 3</Text>
              </HStack>
            );
          },
        }}
      />
      <MaterialTopTabs.Screen
        name={'tab4'}
        options={{ tabBarLabel: 'Label with long title' }}
      />
      <MaterialTopTabs.Screen name={'tab5'} />
    </MaterialTopTabs>
  );
}
