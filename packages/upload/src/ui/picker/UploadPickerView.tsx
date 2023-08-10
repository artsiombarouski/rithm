import {
  Pressable,
  Text,
  usePropsResolution,
  useTheme,
  useToken,
  VStack,
} from 'native-base';
import * as DocumentPicker from 'expo-document-picker';
import React, { useRef } from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useFileDrop } from './useFileDrop';
import { UploadPickerSinglePlaceholder } from './UploadPickerSinglePlaceholder';
import { UploadPickerPlaceholderProps } from './types';
import { isFileTypeMatching } from '../../mime-utils';

export type UploadPickerViewProps = {
  onPicked: (file: File[]) => void;
  supportedTypes?: string[];
  multiple?: boolean;
  forReplace?: boolean;
  canShowReplaceOverlay?: boolean;
  style?: StyleProp<ViewStyle>;
  selectedStyle?: StyleProp<ViewStyle>;
  placeholder?: React.ComponentType<UploadPickerPlaceholderProps>;
  clickable?: boolean;
};

export const UploadPickerView = (props: UploadPickerViewProps) => {
  const {
    onPicked,
    supportedTypes,
    multiple,
    forReplace,
    canShowReplaceOverlay,
    placeholder = UploadPickerSinglePlaceholder,
    style,
    selectedStyle,
    clickable = true,
  } = props;
  const theme = useTheme();
  const handleClick = (e: NativeSyntheticEvent<any>) => {
    if (e.defaultPrevented || !clickable) {
      return;
    }
    DocumentPicker.getDocumentAsync({
      multiple: multiple,
      type: supportedTypes,
    }).then((res) => {
      onPicked?.(res.assets.map((e) => e.file));
    });
  };

  const cardProps = usePropsResolution('Card', {});
  const [defaultRadius] = useToken('radii', [cardProps.borderRadius]);
  const containerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      width: '100px',
      height: '100px',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.colors.gray['300'],
      borderRadius: defaultRadius,
      overflow: 'hidden',
    },
    style,
  ]);

  const selectedContainerStyle: StyleProp<ViewStyle> = StyleSheet.flatten([
    {
      borderColor: theme.colors.primary['500'],
    },
    selectedStyle,
  ]);

  const dragProgress = useSharedValue(0);
  const animatedContainerStyle = useAnimatedStyle(() => {
    const mergedStyle = StyleSheet.flatten([
      containerStyle,
      dragProgress.value > 0 && selectedContainerStyle,
    ]);

    return StyleSheet.flatten([
      mergedStyle,
      containerStyle.borderColor &&
        mergedStyle.borderColor && {
          borderColor: interpolateColor(
            dragProgress.value,
            [0, 1],
            [
              containerStyle.borderColor.toString(),
              mergedStyle.borderColor.toString(),
            ],
          ),
        },
      containerStyle.backgroundColor &&
        mergedStyle.backgroundColor && {
          backgroundColor: interpolateColor(
            dragProgress.value,
            [0, 1],
            [
              containerStyle.backgroundColor.toString(),
              mergedStyle.backgroundColor.toString(),
            ],
          ),
        },
    ]);
  }, [dragProgress]);

  const overlayStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: dragProgress.value,
      backgroundColor: 'rgba(0,0,0,0.6)',
    };
  });

  let children = (
    <>
      {React.createElement(placeholder, {
        dragProgress: dragProgress,
        forReplace: forReplace,
      })}
      {canShowReplaceOverlay && (
        <Animated.View pointerEvents={'none'} style={overlayStyle}>
          <VStack flex={1} alignItems={'center'} justifyContent={'center'}>
            <Text color={'white'}>Replace</Text>
          </VStack>
        </Animated.View>
      )}
    </>
  );

  if (Platform.OS === 'web') {
    const containerRef = useRef<any>();
    useFileDrop({
      containerRef: containerRef,
      multiple: multiple,
      onClick: handleClick,
      onDrop: (files) => {
        const filteredFiles = supportedTypes
          ? files.filter((file) => {
              return supportedTypes.some((type) =>
                isFileTypeMatching(file, type),
              );
            })
          : files;
        if (filteredFiles.length > 0) {
          onPicked?.(filteredFiles);
        }
      },
      onDragging: (dragging) =>
        (dragProgress.value = withSpring(dragging ? 1 : 0)),
    });
    return (
      <Animated.View
        ref={containerRef}
        style={[animatedContainerStyle, { cursor: 'pointer' } as any]}
      >
        {children}
      </Animated.View>
    );
  }
  return (
    <Pressable style={containerStyle} onPress={handleClick}>
      {children}
    </Pressable>
  );
};
