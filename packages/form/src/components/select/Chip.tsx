import {
  CloseIcon,
  HStack,
  IBoxProps,
  IconButton,
  IIconProps,
  ITextProps,
  Text,
  useTheme,
} from 'native-base';

export type ChipProps = IBoxProps & {
  title?: string;
  textProps?: ITextProps;
  iconProps?: IIconProps;
  onRemove?: () => void;
};

export const Chip = (props: ChipProps) => {
  const { title, textProps, iconProps, onRemove, ...restProps } = props;
  const theme = useTheme();
  return (
    <HStack
      pl={3}
      pr={onRemove ? 0 : 1}
      backgroundColor={theme.colors.primary['300']}
      borderRadius={'3xl'}
      alignItems={'center'}
      overflow={'hidden'}
      {...restProps}
    >
      <Text {...textProps}>{title}</Text>
      {onRemove && (
        <IconButton
          icon={<CloseIcon />}
          onPress={onRemove}
          size={'xs'}
          {...iconProps}
        />
      )}
    </HStack>
  );
};
