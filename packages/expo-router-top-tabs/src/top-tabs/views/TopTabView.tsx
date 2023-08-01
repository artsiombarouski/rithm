import {
  getHeaderTitle,
  Header,
  SafeAreaProviderCompat,
  Screen,
} from '@react-navigation/elements';
import type {
  ParamListBase,
  TabNavigationState,
} from '@react-navigation/native';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import type {
  TopTabBarProps,
  TopTabDescriptorMap,
  TopTabHeaderProps,
  TopTabNavigationConfig,
  TopTabNavigationHelpers,
  TopTabNavigationProp,
} from '../types';
import TopTabBarHeightCallbackContext from '../utils/TopTabBarHeightCallbackContext';
import TopTabBarHeightContext from '../utils/TopTabBarHeightContext';
import TopTabBar, { getTabBarHeight } from './TopTabBar';
import { MaybeScreen, MaybeScreenContainer } from './ScreenFallback';

type Props = TopTabNavigationConfig & {
  state: TabNavigationState<ParamListBase>;
  navigation: TopTabNavigationHelpers;
  descriptors: TopTabDescriptorMap;
};

export default function TopTabView(props: Props) {
  const {
    tabBar = (props: TopTabBarProps) => <TopTabBar {...props} />,
    tabBarPosition = 'bottom',
    state,
    navigation,
    descriptors,
    safeAreaInsets,
    detachInactiveScreens = Platform.OS === 'web' ||
      Platform.OS === 'android' ||
      Platform.OS === 'ios',
    sceneContainerStyle,
  } = props;

  const focusedRouteKey = state.routes[state.index].key;
  const [loaded, setLoaded] = React.useState([focusedRouteKey]);

  if (!loaded.includes(focusedRouteKey)) {
    setLoaded([...loaded, focusedRouteKey]);
  }

  const dimensions = SafeAreaProviderCompat.initialMetrics.frame;
  const [tabBarHeight, setTabBarHeight] = React.useState(() =>
    getTabBarHeight({
      state,
      descriptors,
      dimensions,
      layout: { width: dimensions.width, height: 0 },
      insets: {
        ...SafeAreaProviderCompat.initialMetrics.insets,
        ...props.safeAreaInsets,
      },
      style: descriptors[state.routes[state.index].key].options.tabBarStyle,
    }),
  );

  const renderTabBar = () => {
    return (
      <SafeAreaInsetsContext.Consumer>
        {(insets) =>
          tabBar({
            state: state,
            descriptors: descriptors,
            navigation: navigation,
            insets: {
              top: safeAreaInsets?.top ?? insets?.top ?? 0,
              right: safeAreaInsets?.right ?? insets?.right ?? 0,
              bottom: safeAreaInsets?.bottom ?? insets?.bottom ?? 0,
              left: safeAreaInsets?.left ?? insets?.left ?? 0,
            },
          })
        }
      </SafeAreaInsetsContext.Consumer>
    );
  };

  const { routes } = state;

  return (
    <SafeAreaProviderCompat
      style={{
        flexDirection:
          tabBarPosition === 'bottom' ? 'column' : 'column-reverse',
      }}
    >
      <MaybeScreenContainer
        enabled={detachInactiveScreens}
        hasTwoStates
        style={styles.container}
      >
        {routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const { lazy = true, unmountOnBlur } = descriptor.options;
          const isFocused = state.index === index;

          if (unmountOnBlur && !isFocused) {
            return null;
          }

          if (lazy && !loaded.includes(route.key) && !isFocused) {
            // Don't render a lazy screen if we've never navigated to it
            return null;
          }

          const {
            freezeOnBlur,
            header = ({ layout, options }: TopTabHeaderProps) => (
              <Header
                {...options}
                layout={layout}
                title={getHeaderTitle(options, route.name)}
              />
            ),
            headerShown,
            headerStatusBarHeight,
            headerTransparent,
          } = descriptor.options;

          return (
            <MaybeScreen
              key={route.key}
              style={[StyleSheet.absoluteFill, { zIndex: isFocused ? 0 : -1 }]}
              visible={isFocused}
              enabled={detachInactiveScreens}
              freezeOnBlur={freezeOnBlur}
            >
              <TopTabBarHeightContext.Provider value={tabBarHeight}>
                <Screen
                  focused={isFocused}
                  route={descriptor.route}
                  navigation={descriptor.navigation}
                  headerShown={headerShown}
                  headerStatusBarHeight={headerStatusBarHeight}
                  headerTransparent={headerTransparent}
                  header={header({
                    layout: dimensions,
                    route: descriptor.route,
                    navigation:
                      descriptor.navigation as TopTabNavigationProp<ParamListBase>,
                    options: descriptor.options,
                  })}
                  style={sceneContainerStyle}
                >
                  {descriptor.render()}
                </Screen>
              </TopTabBarHeightContext.Provider>
            </MaybeScreen>
          );
        })}
      </MaybeScreenContainer>
      <TopTabBarHeightCallbackContext.Provider value={setTabBarHeight}>
        {renderTabBar()}
      </TopTabBarHeightCallbackContext.Provider>
    </SafeAreaProviderCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
