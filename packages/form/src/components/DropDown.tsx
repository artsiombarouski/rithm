import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Icon, Spacer, Text, Menu, IMenuProps } from 'native-base';
import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export type DropDownItem = {
  key: any;
  label?: string;
};

export type DropDownProps = Omit<IMenuProps, 'trigger'> & {
  onSelect: (item: DropDownItem) => void;
  value?: any;
  options?: DropDownItem[];
  useAnchorSize?: boolean;
};

export function DropDown(props: DropDownProps) {
  const { onSelect, value, options, useAnchorSize, ...restProps } = props;
  const [anchorSize, setAnchorSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    setAnchorSize({ width: layout.width, height: layout.height });
  }, []);
  return (
    <Menu
      placement={'bottom'}
      {...restProps}
      trigger={(triggerProps) => {
        const title = value ?? 'Click to select something';
        return (
          <Button onLayout={onLayout} variant={'outline'} {...triggerProps}>
            {title}
          </Button>
        );
      }}
    >
      {options?.map((option) => {
        return (
          <Menu.Item
            style={
              useAnchorSize && {
                ...anchorSize,
                minWidth: anchorSize.width,
                minHeight: anchorSize.height,
              }
            }
            onPress={() => {
              onSelect(option);
            }}
          >
            <Text>{option.label ?? option.key}</Text>
            <Spacer />
            <Icon
              opacity={value === option.key ? 1 : 0}
              as={MaterialCommunityIcons}
              name="check"
            />
          </Menu.Item>
        );
      })}
    </Menu>
  );
}
