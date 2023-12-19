import {
  getCapitalizedAndLowercasedString,
  getLowercasedAndUnderscoredString,
} from '../../utils';
import { Chip } from './Chip';
import { SelectProps } from './Select';
import { SelectMultipleContainer } from './SelectMultipleContainer';
import {
  View,
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
  IInputProps,
} from 'native-base';
import { Popper } from 'native-base/lib/module/components/composites/Popper';
import React, { useEffect, useRef, useState } from 'react';
import { useWindowDimensions, ListRenderItemInfo } from 'react-native';

export type CreatableSelectProps<OptionType = any> = Omit<
  SelectProps<OptionType>,
  'useObjects' | 'multiple'
> & {
  inputProps?: Omit<IInputProps, 'value' | 'onChangeText'>;
};

export function CreatableSelect<OptionType = any>(
  props: CreatableSelectProps<OptionType>,
) {
  const {
    options,
    keyProperty,
    titleProperty,
    value: valueFromProps,
    onChange,
    listProps,
    renderItem,
    renderChip,
    placeholder,
    chipProps,
    containerProps,
    inputProps,
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

  if (valueFromProps !== undefined && valueFromProps !== null) {
    value = valueFromProps;
  }

  const isOptionSelected = (option: OptionType) => {
    if (!value) {
      return false;
    }
    return (value as OptionType[]).some(
      (opt) => getOptionKey(opt) === getOptionKey(option),
    );
  };

  const handleRemove = (option: any) => {
    if (!value) {
      return;
    }
    const optionKey = getOptionKey(option);
    const targetOptions = (value as OptionType[]).filter(
      (e) => getOptionKey(e) !== optionKey,
    );
    onChange?.(targetOptions);
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

  const [listOptions, setListOptions] = useState(options);

  const getOptions = async (query: string) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
    return listOptions.filter((e) =>
      e[titleProperty].toLowerCase().includes(query.trim().toLowerCase()),
    );
  };

  const [currentValue, setCurrentValue] = useState('');
  const [popperState, setPopperState] = useState<{
    options: OptionType[];
    isVisible: boolean;
    isLoading: boolean;
  }>({
    options: [],
    isVisible: false,
    isLoading: false,
  });

  useEffect(() => {
    let isCanceled;
    if (currentValue.length === 0) {
      setPopperState({
        options: listOptions,
        isVisible: false,
        isLoading: false,
      });
    } else {
      setPopperState({
        options: [],
        isVisible: false,
        isLoading: true,
      });
      getOptions(currentValue)
        .then((result) => {
          if (isCanceled) {
            return;
          }
          setPopperState({
            options: result,
            isVisible: true,
            isLoading: false,
          });
        })
        .catch((e) => {
          setPopperState({
            options: [],
            isVisible: true,
            isLoading: false,
          });
        });
    }
    return () => {
      isCanceled = true;
    };
  }, [currentValue]);

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
        <SelectMultipleContainer {...(containerProps as any)}>
          <HStack flex={1} w={'100%'}>
            <View
              p={1}
              flex={1}
              display={'flex'}
              flexWrap={'wrap'}
              flexDirection={'row'}
              alignItems={'center'}
              overflowX={'hidden'}
            >
              {(value as OptionType[])?.map(
                renderChip ?? internalRenderChip,
              ) ?? (
                <Text pl={2} color={'text.100'}>
                  {placeholder}
                </Text>
              )}
              <Input
                value={currentValue}
                onChangeText={(value) => {
                  setCurrentValue(value);
                }}
                flex={1}
                fontSize={'sm'}
                variant={'unstyled'}
                minW={'100px'}
                {...inputProps}
              />
            </View>
            {
              <Box pr={2} pt={3}>
                {renderIcon()}
              </Box>
            }
          </HStack>
        </SelectMultipleContainer>
      </Pressable>
    );
  };

  const internalRenderItem = (info: ListRenderItemInfo<OptionType>) => {
    const isSelected = isOptionSelected(info.item);
    const handleClick = () => {
      const optionKey = getOptionKey(info.item);
      let targetOptions: OptionType[];
      if (!value) {
        targetOptions = [info.item];
      } else if (isSelected) {
        targetOptions = (value as OptionType[]).filter(
          (e) => getOptionKey(e) !== optionKey,
        );
      } else {
        targetOptions = [...(value as []), info.item];
      }
      onChange?.(targetOptions);
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

  const renderListHeaderComponent = () => {
    if (popperState.options.length === 0 && !popperState.isLoading) {
      const handleClick = () => {
        const newOptionTitle = getCapitalizedAndLowercasedString(currentValue);
        const newOptionKey = getLowercasedAndUnderscoredString(currentValue);
        if (
          !listOptions.some(
            (option) =>
              option[titleProperty] === newOptionTitle ||
              option[keyProperty] === newOptionKey,
          )
        ) {
          const newOption = {
            [keyProperty]: newOptionKey,
            [titleProperty]: newOptionTitle,
          };
          setListOptions([newOption as OptionType, ...listOptions]); //add new item to listOptions
          let targetOptions: OptionType[];
          if (!value) {
            targetOptions = [newOption as OptionType];
          } else {
            targetOptions = [
              ...(value as OptionType[]),
              newOption as OptionType,
            ];
          }
          onChange?.(targetOptions);
          setCurrentValue('');
          setOverlayVisible(false);
        }
      };
      return (
        <Pressable onPress={handleClick}>
          <Text>Create "{currentValue}"</Text>
        </Pressable>
      );
    }
    return <></>;
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
                setCurrentValue('');
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
                  data={popperState.options ?? []}
                  style={{ backgroundColor: theme.colors.white }}
                  renderItem={internalRenderItem}
                  disableVirtualization={true}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => getOptionKey(item)}
                  ListHeaderComponent={renderListHeaderComponent}
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
