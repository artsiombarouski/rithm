import { TextInputProps } from 'react-native';

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
