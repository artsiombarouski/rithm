import { Platform, TextInputProps } from 'react-native';

export function useInputAutoHeight(
  props: Pick<TextInputProps, 'onChange' | 'onLayout' | 'multiline'> = {},
  enabled: boolean = true,
): Pick<TextInputProps, 'onChange' | 'onLayout'> {
  if (!enabled) {
    return {};
  }
  const adjustTextInputSize = (evt: any) => {
    const el = evt?.target || evt?.nativeEvent?.target;
    if (el && props.multiline) {
      el.style.height = 0;
      const newHeight = el.offsetHeight - el.clientHeight + el.scrollHeight;
      el.style.height = `${newHeight}px`;
    }
  };

  return {
    onChange: (e) => {
      adjustTextInputSize(e);
      props.onChange?.(e);
    },
    onLayout: (e) => {
      adjustTextInputSize(e);
      props.onLayout?.(e);
    },
  };
}

const ua = window.navigator?.userAgent;
export const isWeb = Platform.OS === 'web';
const isIOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
const isWebKit = !!ua.match(/WebKit/i);
export const isIOSSafari = isIOS && isWebKit && !ua.match(/CriOS/i);
export const isIOSChrome = isIOS && isWebKit && !ua.match(/Version/i);

export const isSafari =
  isWeb &&
  navigator &&
  navigator.vendor?.match(/apple/i) &&
  !navigator.userAgent?.match(/crios/i) &&
  !navigator.userAgent?.match(/fxios/i) &&
  !navigator.userAgent?.match(/Opera|OPT\//);

export function getCapitalizedAndLowercasedString(input: string) {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function getLowercasedAndUnderscoredString(input) {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => {
      // Detect acronyms (a sequence of uppercase letters, optionally enclosed in parentheses)
      const isAcronym = word.match(/^(\([A-Z]+\)|[A-Z]+)$/);
      return isAcronym ? word : word.toLowerCase();
    })
    .join('_');
}

export function getKeyConvertedToTitle(input: string) {
  // Replace underscores with spaces
  const stringWithSpaces = input.replace(/_/g, ' ');

  // Capitalize the first letter of each word, but keep acronyms in uppercase
  return stringWithSpaces
    .split(/\s+/)
    .map((word) =>
      // Check if the word is in parentheses and is uppercase, keep it uppercase
      word.startsWith('(') && word.endsWith(')') && word.toUpperCase() === word
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ');
}
