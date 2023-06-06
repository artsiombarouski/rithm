import {
  Backdrop,
  Box,
  IMenuProps,
  Overlay,
  PresenceTransition,
  useControllableState,
  usePropsResolution,
} from 'native-base';
import React, { forwardRef, memo } from 'react';
import {
  useMenu,
  useMenuTrigger,
  useMenuTypeahead,
} from 'native-base/src/components/composites/Menu/useMenu';
import { MenuContext } from 'native-base/src/components/composites/Menu/MenuContext';
import { AccessibilityInfo } from 'react-native';
import { useHasResponsiveProps } from 'native-base/src/hooks/useHasResponsiveProps';
// @ts-ignore
import { Popper } from 'native-base/lib/module/components/composites/Popper';

const FormDropDownMenu = (
  {
    trigger,
    closeOnSelect = true,
    children,
    onOpen,
    onClose,
    isOpen: isOpenProp,
    defaultIsOpen,
    placement = 'bottom left',
    ...props
  }: IMenuProps,
  ref?: any,
) => {
  const triggerRef = React.useRef(null);
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
  } = usePropsResolution('Menu', props);
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

  const updatedTrigger = () => {
    return trigger(
      {
        ...triggerProps,
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
            {...resolvedProps}
          >
            <Backdrop onPress={handleClose} {..._backdrop} />
            <Popper.Content isOpen={isOpen}>
              <MenuContext.Provider
                value={{ closeOnSelect, onClose: handleClose }}
              >
                {/*<FocusScope contain restoreFocus autoFocus>*/}
                <FormDropdownContent menuRef={ref} {...resolvedProps}>
                  {children}
                </FormDropdownContent>
                {/*</FocusScope>*/}
              </MenuContext.Provider>
            </Popper.Content>
          </Popper>
        </PresenceTransition>
      </Overlay>
    </>
  );
};

const FormDropdownContent = ({
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

export default memo(forwardRef(FormDropDownMenu));
