import { useTheme } from 'native-base';
import { TopTabs } from '@artsiombarouski/rn-expo-router-top-tabs';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const theme = useTheme();
  return (
    <TopTabs
      tabBarPosition={'top'}
      screenOptions={{
        tabBarGap: 24,
        tabBarIconSize: 20,
        tabBarItemStyle: {
          backgroundColor: theme.colors.primary['100'],
          borderRadius: 24,
          paddingLeft: 8,
          paddingRight: 8,
        },
        scrollEnabled: false,
        tabBarStyle: {
          paddingLeft: '10%',
          paddingRight: '10%',
        },
      }}
    >
      <TopTabs.Screen name={'tab1'} />
      <TopTabs.Screen
        name={'tab2'}
        options={{ tabBarLabel: 'Label with some long title' }}
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
  );
}
