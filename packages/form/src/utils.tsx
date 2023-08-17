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
