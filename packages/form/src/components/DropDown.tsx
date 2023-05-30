import React, { useCallback, useState } from 'react';
import { LayoutChangeEvent, ViewProps } from 'react-native';
import { Menu, MenuProps } from 'react-native-paper';

export type DropDownItem = {
  key: any;
  label?: string;
};

export type DropDownAnchorProps = Pick<ViewProps, 'onLayout'> & {
  onPress: () => void;
};

export type DropDownProps<T = any> = Omit<
  MenuProps,
  'anchor' | 'visible' | 'onDismiss' | 'children' | 'theme'
> & {
  anchor: (props: DropDownAnchorProps) => React.ReactNode;
  onSelect: (item: DropDownItem) => void;
  value?: any;
  options?: DropDownItem[];
  useAnchorSize?: boolean;
};

export function DropDown(props: DropDownProps) {
  const { anchor, onSelect, value, options, useAnchorSize, ...restProps } =
    props;
  const [isVisible, setVisible] = useState<boolean>(false);
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
      visible={isVisible}
      onDismiss={() => setVisible(false)}
      anchor={anchor({
        onLayout,
        onPress: () => {
          setVisible(true);
        },
      })}
      anchorPosition={'bottom'}
      {...restProps}
    >
      {options?.map((option) => {
        return (
          <Menu.Item
            title={option.label ?? option.key}
            trailingIcon={value === option.key ? 'check' : undefined}
            style={
              useAnchorSize && {
                ...anchorSize,
                minWidth: anchorSize.width,
                minHeight: anchorSize.height,
              }
            }
            onPress={() => {
              onSelect(option);
              setVisible(false);
            }}
          />
        );
      })}
    </Menu>
  );
}
