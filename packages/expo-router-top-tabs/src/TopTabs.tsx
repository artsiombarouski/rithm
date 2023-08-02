import { Pressable } from '@bacons/react-views';
import React from 'react';
import { Platform } from 'react-native';
import { createTopTabNavigator, TopTabNavigationOptions } from './top-tabs';
import { Link, withLayoutContext } from 'expo-router';
import { Href } from 'expo-router/build/link/href';

// This is the only way to access the navigator.
const TopTabNavigator = createTopTabNavigator().Navigator;

export const TopTabs = withLayoutContext<
  TopTabNavigationOptions & { href?: Href | null },
  typeof TopTabNavigator
>(TopTabNavigator, (screens) => {
  // Support the `href` shortcut prop.
  return screens.map((screen) => {
    if (
      typeof screen.options !== 'function' &&
      screen.options?.href !== undefined
    ) {
      const { href, ...options } = screen.options;
      if (options.tabBarButton) {
        throw new Error('Cannot use `href` and `tabBarButton` together.');
      }
      return {
        ...screen,
        options: {
          ...options,
          isHidden: href == null ? true : undefined,
          tabBarButton: (props) => {
            if (href == null) {
              return null;
            }
            const children =
              Platform.OS === 'web' ? (
                props.children
              ) : (
                <Pressable>{props.children}</Pressable>
              );
            return (
              <Link
                {...props}
                style={[{ display: 'flex' }, props.style]}
                href={href}
                asChild={Platform.OS !== 'web'}
                children={children}
              />
            );
          },
        },
      };
    }
    return screen;
  });
});

export default TopTabs;
