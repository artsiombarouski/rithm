import { ArrowLeftIcon } from '../../assets';
import { ArrowProps } from './types';
import { IconButton } from 'native-base';
import React from 'react';

export const CalendarArrow = ({ direction, onPress, ...props }: ArrowProps) => {
  return (
    <IconButton
      onPress={onPress}
      p={'6px'}
      icon={
        <ArrowLeftIcon
          size={5}
          color={'blueGray.700'}
          style={{
            transform: [{ rotate: `${direction === 'left' ? 0 : 180}deg` }],
          }}
        />
      }
      {...props}
    />
  );
};
