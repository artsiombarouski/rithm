import { DeleteIcon, EyeIcon } from '../Icons';
import { useHover } from '../hooks';
import {
  HStack,
  IconButton,
  usePropsResolution,
  useTheme,
  useToken,
  View,
} from 'native-base';
import { ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type FileContainerViewProps = ViewProps & {
  error?: boolean;
  onRemoveClicked?: () => void;
  showPreview?: () => void;
  canShowOverlay?: boolean;
  canDelete?: boolean;
  canPreview?: boolean;
};

export const FileContainerView = (props: FileContainerViewProps) => {
  const {
    style,
    children,
    error,
    onRemoveClicked,
    showPreview,
    canShowOverlay = true,
    canDelete = true,
    canPreview = true,
    ...restProps
  } = props;
  const theme = useTheme();
  const cardProps = usePropsResolution('Card', {});
  const [defaultRadius] = useToken('radii', [cardProps.borderRadius]);
  const innerRadius = (style as any)?.borderRadius ?? defaultRadius;

  const hoveredValue = useSharedValue(0);
  const hoverProps = useHover({
    onHoverChange: (hovered) => {
      hoveredValue.value = withSpring(hovered ? 1 : 0);
    },
  });
  const overlayStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: hoveredValue.value,
      backgroundColor: 'rgba(0,0,0,0.6)',
    };
  });

  return (
    <Animated.View
      {...restProps}
      {...hoverProps}
      style={[
        {
          borderWidth: 1,
          borderColor: theme.colors.gray['300'],
          borderRadius: defaultRadius,
          padding: 8,
          overflow: 'hidden',
        },
        style,
        error && {
          borderColor: theme.colors.error['500'],
        },
      ]}
    >
      <View
        style={{
          flex: 1,
          overflow: 'hidden',
          borderRadius: innerRadius,
        }}
      >
        {children}
      </View>
      {canShowOverlay && (canPreview || canDelete) && (
        <Animated.View style={overlayStyle} pointerEvents={'box-none'}>
          <HStack flex={1} alignItems={'center'} justifyContent={'center'}>
            {canPreview && (
              <IconButton
                onPress={showPreview}
                icon={<EyeIcon color={'white'} />}
              />
            )}
            {canDelete && (
              <IconButton
                icon={<DeleteIcon />}
                colorScheme={'error'}
                onPress={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveClicked?.();
                }}
              />
            )}
          </HStack>
        </Animated.View>
      )}
    </Animated.View>
  );
};
