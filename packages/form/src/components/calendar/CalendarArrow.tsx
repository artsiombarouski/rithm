import { ArrowProps } from './types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Icon, IconButton } from 'native-base';
import React from 'react';

export const CalendarArrow = ({ direction, onPress, ...props }: ArrowProps) => {
  return (
    <IconButton
      onPress={onPress}
      p={'6px'}
      icon={
        <Icon
          as={MaterialCommunityIcons}
          name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
          color={'blueGray.700'}
        />
      }
      {...props}
    />
  );
};
