import { MissingIcon } from '@react-navigation/elements';
import {
  CommonActions,
  NavigationContext,
  NavigationRouteContext,
  ParamListBase,
  TabNavigationState,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import React from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import type { TopTabBarProps, TopTabDescriptorMap } from '../types';
import TopTabBarHeightCallbackContext from '../utils/TopTabBarHeightCallbackContext';
import useIsKeyboardShown from '../utils/useIsKeyboardShown';
import TopTabItem from './TopTabItem';
import { Separator } from './Separator';

type Props = TopTabBarProps & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
};

const useNativeDriver = Platform.OS !== 'web';

type Options = {
  state: TabNavigationState<ParamListBase>;
  descriptors: TopTabDescriptorMap;
  layout: { height: number; width: number };
  dimensions: { height: number; width: number };
};

export default function SideTabBar({
  state,
  navigation,
  descriptors,
  insets,
  style,
}: Props) {
  const { colors } = useTheme();
  const buildLink = useLinkBuilder();

  const focusedRoute = state.routes[state.index];
  const focusedDescriptor = descriptors[focusedRoute.key];
  const focusedOptions = focusedDescriptor.options;

  const {
    tabBarGap,
    tabBarShowLabel,
    tabBarHideOnKeyboard = false,
    tabBarVisibilityAnimationConfig,
    tabBarStyle,
    tabBarBackground,
    tabBarActiveTintColor,
    tabBarInactiveTintColor,
    tabBarActiveBackgroundColor,
    tabBarInactiveBackgroundColor,
  } = focusedOptions;

  const dimensions = useSafeAreaFrame();
  const isKeyboardShown = useIsKeyboardShown();

  const onHeightChange = React.useContext(TopTabBarHeightCallbackContext);

  const shouldShowTabBar = !(tabBarHideOnKeyboard && isKeyboardShown);

  const visibilityAnimationConfigRef = React.useRef(
    tabBarVisibilityAnimationConfig,
  );

  React.useEffect(() => {
    visibilityAnimationConfigRef.current = tabBarVisibilityAnimationConfig;
  });

  const [isTabBarHidden, setIsTabBarHidden] = React.useState(!shouldShowTabBar);

  const [visible] = React.useState(
    () => new Animated.Value(shouldShowTabBar ? 1 : 0),
  );

  React.useEffect(() => {
    const visibilityAnimationConfig = visibilityAnimationConfigRef.current;

    if (shouldShowTabBar) {
      const animation =
        visibilityAnimationConfig?.show?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 1,
        useNativeDriver,
        duration: 250,
        ...visibilityAnimationConfig?.show?.config,
      }).start(({ finished }) => {
        if (finished) {
          setIsTabBarHidden(false);
        }
      });
    } else {
      setIsTabBarHidden(true);

      const animation =
        visibilityAnimationConfig?.hide?.animation === 'spring'
          ? Animated.spring
          : Animated.timing;

      animation(visible, {
        toValue: 0,
        useNativeDriver,
        duration: 200,
        ...visibilityAnimationConfig?.hide?.config,
      }).start();
    }

    return () => visible.stopAnimation();
  }, [visible, shouldShowTabBar]);

  const [layout, setLayout] = React.useState({
    height: 0,
    width: dimensions.width,
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    onHeightChange?.(height);

    setLayout((layout) => {
      if (height === layout.height && width === layout.width) {
        return layout;
      } else {
        return {
          height,
          width,
        };
      }
    });
  };

  const { routes } = state;

  const tabBarBackgroundElement = tabBarBackground?.();

  const renderTabList = () => {
    const visibleRoutes = routes.filter(
      (route) => !descriptors[route.key].options.isHidden,
    );
    return (
      <View accessibilityRole="tablist" style={styles.content}>
        {visibleRoutes.map((route, index) => {
          const focused = index === state.index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate({ name: route.name, merge: true }),
                target: state.key,
              });
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const accessibilityLabel =
            options.tabBarAccessibilityLabel !== undefined
              ? options.tabBarAccessibilityLabel
              : typeof label === 'string' && Platform.OS === 'ios'
              ? `${label}, tab, ${index + 1} of ${visibleRoutes.length}`
              : undefined;

          return (
            <NavigationContext.Provider
              key={route.key}
              value={descriptors[route.key].navigation}
            >
              {tabBarGap && index > 0 && index < visibleRoutes.length && (
                <Separator height={tabBarGap} />
              )}
              <NavigationRouteContext.Provider value={route}>
                <TopTabItem
                  route={route}
                  descriptor={descriptors[route.key]}
                  focused={focused}
                  horizontal={true}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  accessibilityLabel={accessibilityLabel}
                  to={buildLink(route.name, route.params)}
                  testID={options.tabBarTestID}
                  allowFontScaling={options.tabBarAllowFontScaling}
                  activeTintColor={tabBarActiveTintColor}
                  inactiveTintColor={tabBarInactiveTintColor}
                  activeBackgroundColor={tabBarActiveBackgroundColor}
                  inactiveBackgroundColor={tabBarInactiveBackgroundColor}
                  button={options.tabBarButton}
                  icon={
                    options.tabBarIcon ??
                    (({ color, size }) => (
                      <MissingIcon color={color} size={size} />
                    ))
                  }
                  badge={options.tabBarBadge}
                  badgeStyle={options.tabBarBadgeStyle}
                  label={label}
                  showLabel={tabBarShowLabel}
                  labelStyle={options.tabBarLabelStyle}
                  iconStyle={options.tabBarIconStyle}
                  iconSize={options.tabBarIconSize}
                  style={[
                    { alignItems: 'center', justifyContent: 'flex-start' },
                    options.tabBarItemStyle,
                    focused && options.tabBarActiveItemStyle,
                  ]}
                  wrapper={options.tabBarItemWrapper}
                />
              </NavigationRouteContext.Provider>
            </NavigationContext.Provider>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          backgroundColor:
            tabBarBackgroundElement != null ? 'transparent' : colors.card,
          borderTopColor: colors.border,
        },
        tabBarStyle,
      ]}
      pointerEvents={isTabBarHidden ? 'none' : 'auto'}
      onLayout={handleLayout}
    >
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {tabBarBackgroundElement}
      </View>
      <ScrollView
        style={styles.contentWrapper}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {renderTabList()}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    left: 0,
    right: 0,
    bottom: 0,
    width: 300,
  },
  contentWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
});
