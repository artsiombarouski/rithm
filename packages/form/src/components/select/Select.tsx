import {
  Backdrop,
  Box,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FlatList,
  HStack,
  Icon,
  Input,
  Overlay,
  Pressable,
  Text,
  usePropsResolution,
  useTheme,
  View,
} from 'native-base';
import React, { useRef, useState } from 'react';
import { Popper } from 'native-base/lib/module/components/composites/Popper';
import { ListRenderItemInfo, useWindowDimensions } from 'react-native';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';
import { Chip, ChipProps } from './Chip';
import { SelectMultipleContainer } from './SelectMultipleContainer';

export type SelectProps<OptionType = any> = {
  options?: OptionType[];
  keyProperty?: string;
  titleProperty?: string;
  value?: OptionType | OptionType[];
  multiple?: boolean;
  placeholder?: string;
  onChange?: (options: OptionType | OptionType[]) => void;
  listProps?: Omit<IFlatListProps<OptionType>, 'renderItem'>;
  renderItem?: (
    data: ListRenderItemInfo<OptionType> & {
      isSelected: boolean;
      onClick: () => void;
    },
  ) => React.ReactElement | null;
  renderChip?: (option: OptionType) => React.ReactElement | null;
  useObjects?: boolean;
  chipProps?: ChipProps;
};

export function Select<OptionType = any>(props: SelectProps<OptionType>) {
  const {
    options,
    keyProperty,
    titleProperty,
    value: valueFromProps,
    multiple,
    onChange,
    listProps,
    renderItem,
    renderChip,
    placeholder,
    useObjects = true,
    chipProps,
  } = props;
  const theme = useTheme();
  const anchorRef = React.useRef(null);
  const popperContentRef = useRef(null);
  const dimensions = useWindowDimensions();
  const [anchorWidth, setAnchorWidth] = useState(0);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const { _overlay, useRNModal, _backdrop, ...resolvedProps } =
    usePropsResolution('Popover', props);

  const getOptionKey = (option: OptionType) => {
    return keyProperty ? option[keyProperty] : option;
  };
  const getOptionTitle = (option: OptionType) => {
    return titleProperty ? option[titleProperty] : option;
  };

  let value: OptionType | OptionType[] | null | undefined = undefined;

  if (valueFromProps) {
    if (multiple) {
      if (useObjects) {
        value = valueFromProps;
      } else {
        value = options.filter((e) =>
          (valueFromProps as OptionType[]).includes(getOptionKey(e)),
        );
      }
    } else {
      if (useObjects) {
        value = valueFromProps;
      } else {
        value = options.find((e) => getOptionKey(e) === valueFromProps);
      }
    }
  }

  const isOptionSelected = (option: OptionType) => {
    if (!value) {
      return false;
    }
    if (multiple) {
      return (value as OptionType[]).some(
        (opt) => getOptionKey(opt) === getOptionKey(option),
      );
    }
    return getOptionKey(value as OptionType) === getOptionKey(option);
  };

  const handleRemove = (option: any) => {
    if (!value) {
      return;
    }
    const optionKey = getOptionKey(option);
    if (multiple) {
      onChange?.(
        (value as OptionType[]).filter((e) => getOptionKey(e) !== optionKey),
      );
    } else if (optionKey === getOptionKey(value as OptionType)) {
      onChange?.(null);
    }
  };

  const renderIcon = () => {
    return (
      <Icon>{isOverlayVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}</Icon>
    );
  };

  const internalRenderChip = (option: OptionType) => {
    return (
      <Chip
        key={`option-${getOptionKey(option)}`}
        m={1}
        {...chipProps}
        title={getOptionTitle(option)}
        onRemove={() => {
          handleRemove(option);
        }}
      />
    );
  };

  const renderAnchor = () => {
    return (
      <Pressable
        ref={anchorRef}
        onLayout={(e) => {
          setAnchorWidth(e.nativeEvent.layout.width);
        }}
        onPress={() => {
          setOverlayVisible(true);
        }}
      >
        {multiple ? (
          <SelectMultipleContainer>
            <HStack flex={1}>
              <View
                p={1}
                flex={1}
                display={'flex'}
                flexWrap={'wrap'}
                flexDirection={'row'}
                alignItems={'center'}
              >
                {(value as OptionType[])?.map(
                  renderChip ?? internalRenderChip,
                ) ?? (
                  <Text pl={2} color={'gray.400'}>
                    {placeholder}
                  </Text>
                )}
              </View>
              {
                <Box pr={2} pt={3}>
                  {renderIcon()}
                </Box>
              }
            </HStack>
          </SelectMultipleContainer>
        ) : (
          <Input
            editable={false}
            value={value ? getOptionTitle(value as OptionType) : undefined}
            placeholder={placeholder}
            InputRightElement={<Box pr={2}>{renderIcon()}</Box>}
          />
        )}
      </Pressable>
    );
  };

  const internalRenderItem = (info: ListRenderItemInfo<OptionType>) => {
    const isSelected = isOptionSelected(info.item);

    const handleClick = () => {
      const optionKey = getOptionKey(info.item);
      if (multiple) {
        const targetOptions = !value
          ? [info.item]
          : isSelected
          ? (value as OptionType[]).filter((e) => getOptionKey(e) !== optionKey)
          : [...(value as []), info.item];
        onChange(useObjects ? targetOptions : targetOptions.map(getOptionKey));
      } else if (isSelected) {
        onChange(null);
        setOverlayVisible(false);
      } else {
        onChange(useObjects ? info.item : getOptionKey(info.item));
        setOverlayVisible(false);
      }
    };
    if (renderItem) {
      return renderItem({ ...info, isSelected, onClick: handleClick });
    }
    return (
      <Pressable onPress={handleClick}>
        <HStack px={1} py={2} space={'md'} alignItems={'center'}>
          <Text flex={1}>{getOptionTitle(info.item)}</Text>
          {isSelected && <CheckIcon />}
        </HStack>
      </Pressable>
    );
  };

  return (
    <>
      {renderAnchor()}
      {isOverlayVisible && (
        <Overlay
          isOpen={isOverlayVisible}
          useRNModalOnAndroid
          useRNModal={useRNModal}
          {..._overlay}
        >
          <Popper triggerRef={anchorRef} offset={4} {...resolvedProps}>
            <Backdrop
              onPress={() => {
                setOverlayVisible(false);
              }}
              {..._backdrop}
              style={[_backdrop?.style, { backgroundColor: 'transparent' }]}
            />
            <Popper.Content
              ref={popperContentRef}
              flex={1}
              shadow={6}
              borderRadius={8}
              display={'flex'}
              width={anchorWidth}
              overflow={'hidden'}
              isOpen={isOverlayVisible}
              maxHeight={Math.min(450, dimensions.height)}
            >
              <Box flex={1} shadow={3}>
                <FlatList<OptionType>
                  p={4}
                  data={options ?? []}
                  style={{ backgroundColor: theme.colors.white }}
                  renderItem={internalRenderItem}
                  disableVirtualization={true}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => getOptionKey(item)}
                  {...listProps}
                />
              </Box>
            </Popper.Content>
          </Popper>
        </Overlay>
      )}
    </>
  );
}
