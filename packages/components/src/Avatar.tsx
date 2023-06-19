import {
  Avatar as NativeBaseAvatar,
  Container,
  IAvatarProps,
  IContainerProps,
  ITextProps,
  Text,
  useTheme,
} from 'native-base';
import stc from 'string-to-color';
import { isDark } from '../utils';

const getDisplayLetters = (input: string | undefined): string | undefined => {
  if (input.includes(' ')) {
    const splitted = input.split(' ');
    return `${getDisplayLetters(splitted[0])}${
      splitted.length > 1 ? getDisplayLetters(splitted[1]) : ''
    }`;
  }
  return input && input.length > 0 ? input.substring(0, 1) : undefined;
};

type Props = {
  text?: string;
  image?: string;
  size?: number;
  borderRadius?: number;
  textProps?: ITextProps;
  textContainerProps?: IContainerProps;
  avatarProps?: IAvatarProps;
};

export const Avatar = (props: Props) => {
  const {
    text,
    image,
    size = 40,
    borderRadius = size / 2,
    textProps,
    textContainerProps,
    avatarProps,
  } = props;
  const theme = useTheme();
  if (image) {
    return (
      <NativeBaseAvatar
        source={{ uri: image }}
        size={`${size}px`}
        borderRadius={borderRadius}
        {...avatarProps}
      />
    );
  }
  const letters = getDisplayLetters(text);
  const backgroundColor = letters
    ? stc(letters)
    : theme.colors.secondary['500'];
  return (
    <Container
      w={`${size}px`}
      h={`${size}px`}
      borderRadius={borderRadius}
      backgroundColor={backgroundColor}
      overflow={'hidden'}
      alignItems={'center'}
      justifyContent={'center'}
      {...textContainerProps}
    >
      <Text
        fontSize={`${size * 0.5}px`}
        color={isDark(backgroundColor) ? 'white' : 'black'}
        {...(textContainerProps as any)}
      >
        {letters}
      </Text>
    </Container>
  );
};
