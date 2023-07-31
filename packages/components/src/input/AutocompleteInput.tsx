import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  FlatList,
  HStack,
  IBoxProps,
  IInputProps,
  Input,
  Overlay,
  Pressable,
  Spinner,
  Text,
  usePropsResolution,
  useTheme,
} from 'native-base';
import { Popper } from 'native-base/lib/module/components/composites/Popper';
import { ListRenderItemInfo, useWindowDimensions } from 'react-native';
import { useOutsideClick } from '../utils';
import { IFlatListProps } from 'native-base/lib/typescript/components/basic/FlatList';

export type AutocompleteOption = {
  key: string;
  value: string;
};

export type AutocompleteInputProps = {
  getOptions: (query: string) => Promise<AutocompleteOption[]>;
  onChange?: (value: AutocompleteOption) => void;
  inputProps?: IInputProps;
  inputContainerProps?: IBoxProps;
  listProps?: IFlatListProps<AutocompleteOption>;
};

export const AutocompleteInput = (props: AutocompleteInputProps) => {
  const {
    getOptions,
    onChange,
    inputProps,
    inputContainerProps,
    listProps,
    ...restProps
  } = props;
  const theme = useTheme();
  const inputRef = useRef(null);
  const popperContentRef = useRef(null);
  const dimensions = useWindowDimensions();
  const [inputWidth, setInputWidth] = useState(0);
  const [currentValue, setCurrentValue] = useState('');
  const [isInputFocused, setInputFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    AutocompleteOption | undefined
  >(null);
  const [popperState, setPopperState] = useState<{
    options: AutocompleteOption[];
    isVisible: boolean;
    isLoading: boolean;
  }>({
    options: [],
    isVisible: false,
    isLoading: false,
  });
  const { _overlay, useRNModal, ...resolvedProps } = usePropsResolution(
    'Popover',
    props,
  );

  const handleItemClick = (item: AutocompleteOption) => () => {
    setSelectedOption(item);
    onChange?.(item);
  };

  const renderItem = ({ item }: ListRenderItemInfo<AutocompleteOption>) => {
    return (
      <Pressable px={1} py={2} onPress={handleItemClick(item)}>
        <Text>{item.value}</Text>
      </Pressable>
    );
  };

  useOutsideClick(
    [inputRef, popperContentRef],
    () => {
      setInputFocused(false);
    },
    true,
  );

  useEffect(() => {
    if (selectedOption) {
      setCurrentValue(selectedOption.value);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (!isInputFocused) {
      (inputRef.current as any).blur();
    }
  }, [isInputFocused]);

  useEffect(() => {
    if (selectedOption) {
      return;
    }
    let isCanceled;
    if (currentValue.length === 0) {
      setPopperState({
        options: [],
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
  }, [selectedOption, currentValue]);

  const isOverlayVisible =
    isInputFocused &&
    !selectedOption &&
    popperState.isVisible &&
    !popperState.isLoading;

  return (
    <>
      <Box
        {...inputContainerProps}
        onLayout={(e) => {
          setInputWidth(e.nativeEvent.layout.width);
        }}
      >
        <Input
          ref={inputRef}
          {...inputProps}
          value={currentValue}
          onChangeText={(value) => {
            setSelectedOption(null);
            setCurrentValue(value);
            inputProps?.onChangeText?.(value);
          }}
          onFocus={(e) => {
            setInputFocused(true);
            inputProps?.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (isInputFocused) {
              (e.target as any).focus();
            }
            inputProps?.onBlur?.(e);
          }}
          InputRightElement={
            <HStack alignItems={'center'}>
              {popperState.isLoading && (
                <Box w={7} overflow={'hidden'}>
                  <Spinner />
                </Box>
              )}
              {inputProps?.InputRightElement}
            </HStack>
          }
        />
      </Box>
      {isOverlayVisible && (
        <Overlay
          isOpen={isOverlayVisible}
          useRNModalOnAndroid
          useRNModal={useRNModal}
          {..._overlay}
        >
          <Popper
            triggerRef={inputRef}
            offset={4}
            {...restProps}
            {...resolvedProps}
          >
            <Popper.Content
              ref={popperContentRef}
              flex={1}
              shadow={6}
              borderRadius={8}
              display={'flex'}
              width={inputWidth}
              overflow={'hidden'}
              isOpen={isOverlayVisible}
              maxHeight={Math.min(450, dimensions.height)}
            >
              <Box flex={1} shadow={3}>
                <FlatList<AutocompleteOption>
                  p={4}
                  data={popperState.options}
                  style={{ backgroundColor: theme.colors.white }}
                  renderItem={renderItem}
                  disableVirtualization={true}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.key}
                  ListHeaderComponent={() => {
                    if (popperState.options.length === 0) {
                      return <Text>No results</Text>;
                    }
                    return <></>;
                  }}
                  {...listProps}
                />
              </Box>
            </Popper.Content>
          </Popper>
        </Overlay>
      )}
    </>
  );
};
