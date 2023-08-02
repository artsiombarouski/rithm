import { View } from 'react-native';
import React from 'react';

export const Separator = ({
  width,
  height,
}: {
  width?: number | string;
  height?: number | string;
}) => {
  return <View style={{ width, height }} />;
};
