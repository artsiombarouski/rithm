import { Platform } from 'react-native';

export type UseHoverProps = {
  onHoverChange: (hovered?: boolean) => void;
};

export function useHover(props: UseHoverProps) {
  if (Platform.OS !== 'web') {
    return {};
  }
  return {
    // @ts-ignore
    onMouseEnter: (e) => {
      if (e.buttons !== 0) {
        return;
      }
      props.onHoverChange?.(true);
    },
    // @ts-ignore
    onMouseLeave: () => {
      props.onHoverChange?.(false);
    },
  };
}
