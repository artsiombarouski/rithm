import FormDropDownMenu from './FormDropDownMenu';
import { useFocusRing } from '@react-native-aria/focus';
import { useHover } from '@react-native-aria/interactions';
import {
  CheckIcon,
  ChevronDownIcon,
  extractInObject,
  FlatList,
  HStack,
  IInputProps,
  IMenuProps,
  Input,
  Pressable,
  Spacer,
  Spinner,
  stylingProps,
  Text,
  usePropsResolution,
} from 'native-base';
import { useFormControl } from 'native-base/lib/commonjs/components/composites/FormControl';
import { useMenuItem } from 'native-base/lib/commonjs/components/composites/Menu/useMenu';
import { InterfaceSelectProps } from 'native-base/lib/typescript/components/primitives/Select/types';
import { CustomProps } from 'native-base/lib/typescript/components/types';
import React, { useCallback, useState } from 'react';
import { Dimensions, Keyboard, LayoutChangeEvent } from 'react-native';

type LayoutSize = {
  width: number;
  height: number;
};

export type FormDropDownOption = {
  key: any;
  label?: string;
};

export type FormDropDownComponentProps = InterfaceSelectProps &
  CustomProps<'Select'> &
  Pick<IMenuProps, 'placement'> & {
    value?: any;
    options?: FormDropDownOption[];
    onChange: (item: FormDropDownOption) => void;
    useAnchorSize?: boolean;
    isLoading?: boolean;
    inputProps?: Partial<IInputProps>;
  };

export function FormDropDownComponent(props: FormDropDownComponentProps) {
  const {
    value,
    options,
    onChange,
    useAnchorSize,
    isLoading,
    placement,
    isHovered: isHoveredProp,
    isFocused: isFocusedProp,
    isFocusVisible: isFocusVisibleProp,
    variant,
    inputProps,
    ...restProps
  } = props;
  const _anchorRef = React.useRef(null);
  const selectProps = useFormControl({
    isDisabled: restProps.isDisabled,
    nativeID: restProps.nativeID,
  });
  const isDisabled = selectProps.disabled;
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  const { focusProps, isFocusVisible } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled }, _anchorRef);

  const [anchorSize, setAnchorSize] = useState<LayoutSize>({
    width: 0,
    height: 0,
  });
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;
    setAnchorSize({ width: layout.width, height: layout.height });
  }, []);

  const {
    onValueChange,
    children,
    dropdownIcon,
    dropdownCloseIcon,
    dropdownOpenIcon,
    placeholder,
    accessibilityLabel,
    defaultValue,
    _item,
    _selectedItem,
    onOpen,
    onClose,
    optimized,
    _customDropdownIconProps,
    _actionSheet,
    _actionSheetContent,
    _actionSheetBody,
    _webSelect,
    ...resolvedProps
  } = usePropsResolution(
    'Select',
    props,
    {
      isDisabled,
      isHovered: isHoveredProp || isHovered,
      isFocused: isFocusedProp || isFocused,
      isFocusVisible: isFocusVisibleProp || isFocusVisible,
    },
    undefined,
  );
  const [layoutProps, nonLayoutProps] = extractInObject(resolvedProps, [
    ...stylingProps.margin,
    ...stylingProps.flexbox,
    ...stylingProps.position,
    'shadow',
    'opacity',
  ]);

  const rightIcon = isLoading ? (
    <Spinner {..._customDropdownIconProps} size={'sm'} />
  ) : isOpen && dropdownOpenIcon ? (
    dropdownOpenIcon
  ) : !isOpen && dropdownCloseIcon ? (
    dropdownCloseIcon
  ) : dropdownIcon ? (
    dropdownIcon
  ) : (
    <ChevronDownIcon {..._customDropdownIconProps} size={4} />
  );

  const handleClose = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  const selectedOptions = options?.filter((e) => e.key === value) ?? [];

  const renderAnchor = (triggerProps: any) => {
    return (
      <Pressable
        ref={_anchorRef}
        onLayout={onLayout}
        disabled={isDisabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        {...triggerProps}
        {...layoutProps}
        onPress={() => {
          Keyboard.dismiss();
          setIsOpen(true);
          onOpen && onOpen();
        }}
      >
        <Input
          placeholder={placeholder ?? 'TODO: add placeholder'}
          InputRightElement={rightIcon}
          {...nonLayoutProps}
          // NOTE: Adding ts-ignore as we're not exposing isFocused in the Input component
          // @ts-ignore-next-line
          isFocused={isFocused}
          isHovered={isHovered}
          aria-hidden={true}
          importantForAccessibility="no"
          value={
            selectedOptions && selectedOptions.length > 0
              ? selectedOptions.map((e) => e.label).join(', ')
              : ''
          }
          editable={false}
          focusable={false}
          isDisabled={isDisabled}
          pointerEvents="none"
          variant={variant}
          {...inputProps}
        />
      </Pressable>
    );
  };

  const ItemView = ({ option }: { option: FormDropDownOption }) => {
    const menuItemRef = React.useRef<any>(null);
    const { _text, _stack } = usePropsResolution(
      'MenuItem',
      props,
      {
        isDisabled,
      },
      {
        cascadePseudoProps: false,
      },
    );
    const menuItemProps = useMenuItem({
      textValue: option.label ?? option.key,
      ref: menuItemRef,
    });
    return (
      <Pressable
        {...menuItemProps}
        ref={menuItemRef}
        disabled={isDisabled}
        accessibilityState={{
          disabled: isDisabled,
        }}
        onPress={() => {
          onChange(option);
          onValueChange && onValueChange(option);
          setIsOpen(false);
        }}
      >
        <HStack
          {..._stack}
          style={[
            _stack.style,
            useAnchorSize && {
              ...anchorSize,
              minWidth: anchorSize.width,
              minHeight: anchorSize.height,
            },
          ]}
        >
          <Text {..._text}>{option.label ?? option.key}</Text>
          <Spacer />
          <>{value === option.key && <CheckIcon size={4} />}</>
        </HStack>
      </Pressable>
    );
  };

  return (
    <FormDropDownMenu
      isOpen={isOpen}
      onClose={handleClose}
      trigger={renderAnchor}
      maxHeight={Dimensions.get('window').height * 0.7}
      placement={placement ?? 'bottom'}
      padding={0}
    >
      <FlatList<FormDropDownOption>
        data={options ?? []}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => {
          return <ItemView option={item} />;
        }}
      />
    </FormDropDownMenu>
  );
}
