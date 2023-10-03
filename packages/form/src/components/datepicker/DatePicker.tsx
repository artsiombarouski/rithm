import { CalendarIcon } from '../../assets';
import { Calendar, SelectionType } from '../calendar';
import { DatePickerProps } from './types';
import { getInputValue } from './utils';
import { Input, Popover, Pressable } from 'native-base';
import React, { useState } from 'react';

export const DatePicker = (props: DatePickerProps) => {
  const {
    buttonStyle,
    value,
    onChange,
    selectionType = SelectionType.SINGLE,
    mode = 'single',
    placement = 'bottom',
    popoverProps,
    placeholder,
    inputProps,
    ...calendarProps
  } = props || {};
  const [showPopover, setShowPopover] = useState(false);
  return (
    <Popover
      placement={placement}
      isOpen={showPopover}
      onClose={() => setShowPopover(false)}
      trigger={(triggerProps) => {
        return (
          <Pressable {...triggerProps} onPress={() => setShowPopover(true)}>
            <Input
              InputLeftElement={
                <CalendarIcon
                  size={5}
                  ml={3}
                  color={'white'}
                  stroke={'#737373'}
                />
              }
              size={'lg'}
              isFocused={false}
              editable={false}
              focusable={false}
              pointerEvents="none"
              placeholder={placeholder ?? 'Include a date'}
              variant={'outline'}
              numberOfLines={1}
              value={getInputValue(value, selectionType)}
              {...inputProps}
            />
          </Pressable>
        );
      }}
      {...popoverProps}
    >
      <Popover.Content>
        <Calendar
          selectionType={selectionType}
          mode={mode}
          value={value}
          onChange={onChange}
          onDayChanged={() => {
            if (selectionType === SelectionType.SINGLE) {
              setShowPopover(false);
            }
          }}
          {...calendarProps}
        />
      </Popover.Content>
    </Popover>
  );
};
