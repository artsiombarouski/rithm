import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Href } from 'expo-router/build/link/href';

const MaterialTopTabNavigator = createMaterialTopTabNavigator().Navigator;

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions & { href?: Href | null },
  typeof MaterialTopTabNavigator
>(MaterialTopTabNavigator, (screens) => {
  // Support the `href` shortcut prop.
  return screens.map((screen) => {
    if (
      typeof screen.options !== 'function' &&
      screen.options?.href !== undefined
    ) {
      const { href, ...options } = screen.options;
      return {
        ...screen,
        options: {
          ...options,
        },
      };
    }
    return screen;
  });
});
