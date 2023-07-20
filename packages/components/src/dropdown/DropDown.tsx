import {
  Backdrop,
  Box,
  IMenuProps,
  Overlay,
  PresenceTransition,
  useControllableState,
  usePropsResolution,
} from 'native-base';
import React, { forwardRef, memo, useState } from 'react';
import {
  useMenu,
  useMenuTrigger,
  useMenuTypeahead,
} from 'native-base/src/components/composites/Menu/useMenu';
import { MenuContext } from 'native-base/src/components/composites/Menu/MenuContext';
import { AccessibilityInfo, useWindowDimensions } from 'react-native';
import { useHasResponsiveProps } from 'native-base/src/hooks/useHasResponsiveProps';
// @ts-ignore
import { Popper } from 'native-base/lib/module/components/composites/Popper';

type LayoutSize = {
  width: number;
  height: number;
};

export type DropDownPickerProps = IMenuProps & {};

const DropDown = (props: DropDownPickerProps, ref?: any) => {
  const {
    trigger,
    closeOnSelect = true,
    children,
    onOpen,
    onClose,
    isOpen: isOpenProp,
    defaultIsOpen,
    placement = 'bottom left',
    ...restProps
  } = props;

  const triggerRef = React.useRef(null);
  const dimensions = useWindowDimensions();
  const [isOpen, setIsOpen] = useControllableState({
    value: isOpenProp,
    defaultValue: defaultIsOpen,
    onChange: (value) => {
      value ? onOpen && onOpen() : onClose && onClose();
    },
  });

  const {
    _overlay,
    _presenceTransition,
    _backdrop,
    useRNModal,
    ...resolvedProps
  } = usePropsResolution('Menu', restProps);
  const handleOpen = React.useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const handleClose = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const triggerProps = useMenuTrigger({
    handleOpen,
    isOpen,
  });
  const [triggerSize, setTriggerSize] = useState<LayoutSize>({
    width: 0,
    height: 0,
  });

  const updatedTrigger = () => {
    return trigger(
      {
        ...triggerProps,
        onLayout: (event) => {
          setTriggerSize(event.nativeEvent.layout);
        },
        ref: triggerRef,
        onPress: handleOpen,
      },
      { open: isOpen },
    );
  };

  React.useEffect(() => {
    if (isOpen) {
      AccessibilityInfo.announceForAccessibility('Popup window');
    }
  }, [isOpen]);

  //TODO: refactor for responsive prop
  if (useHasResponsiveProps(resolvedProps)) {
    return null;
  }

  return (
    <>
      {updatedTrigger()}
      <Overlay
        isOpen={isOpen}
        onRequestClose={handleClose}
        useRNModalOnAndroid
        useRNModal={useRNModal}
        {..._overlay}
      >
        <PresenceTransition visible={isOpen} {..._presenceTransition}>
          <Popper
            triggerRef={triggerRef}
            onClose={handleClose}
            placement={placement}
            offset={4}
            {...resolvedProps}
          >
            <Backdrop onPress={handleClose} {..._backdrop} />
            <Popper.Content
              isOpen={isOpen}
              flex={1}
              shadow={6}
              borderRadius={8}
              display={'flex'}
              overflow={'hidden'}
              width={triggerSize.width}
              maxHeight={Math.min(450, dimensions.height)}
            >
              <MenuContext.Provider
                value={{ closeOnSelect, onClose: handleClose }}
              >
                <DropDownContent menuRef={ref} flex={1} {...resolvedProps}>
                  {children}
                </DropDownContent>
              </MenuContext.Provider>
            </Popper.Content>
          </Popper>
        </PresenceTransition>
      </Overlay>
    </>
  );
};

const DropDownContent = ({
  menuRef,
  children,
  ...props
}: Omit<IMenuProps, 'trigger'> & { menuRef: any }) => {
  const menuProps = useMenu();
  const typeaheadProps = useMenuTypeahead(menuProps);

  return (
    <Box {...props} {...menuProps} {...typeaheadProps} ref={menuRef}>
      {children}
    </Box>
  );
};

export default memo(forwardRef(DropDown));
