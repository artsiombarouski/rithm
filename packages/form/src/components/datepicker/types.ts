import { CalendarProps, SelectionType } from '../calendar';
import { IInputProps } from 'native-base';
import { StyleProp, ViewStyle } from 'react-native';
import React from "react";

export interface InterfacePopoverProps {
  /**
   * If true, the popover will be opened by default.
   */
  defaultIsOpen?: boolean;
  /**
   * Whether the popover is opened. Useful for controlling the open state.
   */
  isOpen?: boolean;
  /**
   * Whether popover should trap focus.
   * @default true
   */
  trapFocus?: boolean;
  /**
   * Whether the element should flip its orientation (e.g. top to bottom or left to right) when there is insufficient room for it to render completely.
   * @default true
   */
  shouldFlip?: boolean;
  /**
   * The ref of element to receive focus when the popover opens.
   */
  initialFocusRef?: React.RefObject<any>;
  /**
   * The ref of element to receive focus when the modal closes.
   */
  finalFocusRef?: React.RefObject<any>;
  /**
   * Function that returns a React Element. This element will be used as a Trigger for the popover.
   */
  trigger: (_props: any, state: { open: boolean }) => JSX.Element;
  /**
   * The additional offset applied along the cross axis between the element and its trigger element.
   */
  crossOffset?: number;
  /**
   * The additional offset applied along the main axis between the element and its trigger element.
   */
  offset?: number;
  /**
   * Determines whether menu content should overlap with the trigger.
   * @default false
   */
  shouldOverlapWithTrigger?: boolean;
  /**
   * Popover children.
   */
  children: React.ReactNode;
  /**
   * If true, the modal will close when Escape key is pressed.
   * @default true
   */
  isKeyboardDismissable?: boolean;
  /**
   * This function will be invoked when popover is closed. It'll also be called when user attempts to close the popover via Escape key or backdrop press.
   */
  onClose?: () => void;
  /**
   * This function will be invoked when popover is opened.
   */
  onOpen?: () => void;

  /* If true, renders react-native native modal
   * @default false
   */
  useRNModal?: boolean;
  /**
   * Props applied on backdrop.
   */
  _backdrop?: any;
  /**
   * Props applied on overlay.
   */
  _overlay?: any;
}


export type DatePickerProps = Omit<
  CalendarProps,
  'value' | 'onChange' | 'selectionType'
> & {
  value: any; //todo: change types
  onChange: (value: any) => void; //todo: change types
  selectionType?: SelectionType;
  buttonStyle?: StyleProp<ViewStyle>;
  popoverProps?: InterfacePopoverProps;
  placeholder?: string;
  inputProps?: IInputProps;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'right top'
    | 'right bottom'
    | 'left top'
    | 'left bottom';
};
