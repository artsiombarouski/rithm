import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export const GetDimensions = ({ component, onDimensions, ...props }) => {
  const [isTimeToRenderNull, setIsTimeToRenderNull] = useState(false);

  const onLayout = useCallback(
    (event) => {
      const sizes = {
        width: Math.round(event.nativeEvent.layout.width),
        height: Math.round(event.nativeEvent.layout.height),
      };
      onDimensions(sizes);
      if (sizes.width > 0 && sizes.height > 0 && !isTimeToRenderNull) {
        setIsTimeToRenderNull(true);
      }
    },
    [isTimeToRenderNull],
  );

  if (isTimeToRenderNull) return null;
  return (
    <View onLayout={onLayout} style={styles.container} {...props}>
      {component}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    opacity: 0,
    width: '100%',
  },
});
