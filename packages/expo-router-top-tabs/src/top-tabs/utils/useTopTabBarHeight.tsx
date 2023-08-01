import * as React from 'react';

import TopTabBarHeightContext from './TopTabBarHeightContext';

export default function useTopTabBarHeight() {
  const height = React.useContext(TopTabBarHeightContext);

  if (height === undefined) {
    throw new Error(
      "Couldn't find the top tab bar height. Are you inside a screen in Bottom Tab Navigator?",
    );
  }

  return height;
}
