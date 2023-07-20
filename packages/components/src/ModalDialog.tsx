import { isPromise } from '../utils';
import { isEmpty, omit } from 'lodash';
import { AlertDialog, Button, Modal, Text } from 'native-base';
import { IAlertDialogProps } from 'native-base/lib/typescript/components/composites';
import { IModalProps } from 'native-base/src/components/composites/Modal/types';
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';

export type ModalDialogContentProps = {
  onOkClick: (data?: any) => void;
  onCancelClick: () => void;
  isPerformingAction: boolean;
};

type ModalDialogPropsBase = {
  content?: string | ((props: ModalDialogContentProps) => React.ReactElement);
  actions?: (props: {
    onOkClick: (data?: any) => void;
    onCancelClick: () => void;
    isPerformingAction: boolean;
  }) => React.ReactElement;
  title?: string;
  okTitle?: string;
  cancelTitle?: string;
  onOk?: (data?: any) => Promise<boolean> | boolean;
  onCancel?: () => Promise<boolean> | boolean;
  onDismiss?: () => void;
  showCancel?: boolean;
  showActions?: boolean;
  showClose?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  alert?: boolean;
};

type ModalDialogProps = ModalDialogPropsBase &
  (ModalDialogPropsBase['alert'] extends true
    ? Omit<IAlertDialogProps, 'isOpen' | 'onClose'>
    : Omit<IModalProps, 'isOpen' | 'onClose'>);

const ModalDialogView = (props: ModalDialogProps) => {
  const {
    content,
    actions,
    title,
    okTitle = 'OK',
    cancelTitle = 'Cancel',
    onOk,
    onCancel,
    onDismiss,
    showCancel = true,
    showActions = true,
    showClose = false,
    style,
    contentStyle,
    bodyStyle,
    alert = false,
    ...restProps
  } = props;
  const [visible, setVisible] = useState(true);
  const [isPerformingAction, setPerformingAction] = useState<boolean>(false);
  const cancelRef = React.useRef(null);

  const onDialogDismiss = () => {
    setVisible(false);
  };
  const onOkClick = (data?: any) => {
    if (!onOk) {
      setVisible(false);
    } else {
      const fn = onOk(data);
      setPerformingAction(isPromise(fn));
      Promise.resolve(fn).then((result) => {
        if (result) {
          setVisible(false);
        } else {
          setPerformingAction(false);
        }
      });
    }
  };
  const onCancelClick = () => {
    if (!onCancel) {
      setVisible(false);
    } else {
      const fn = onCancel();
      setPerformingAction(isPromise(fn));
      Promise.resolve(fn).then((result) => {
        if (result) {
          setVisible(false);
        } else {
          setPerformingAction(false);
        }
      });
    }
  };

  useEffect(() => {
    if (!visible) {
      onDismiss?.();
    }
  }, [visible]);

  const DialogComponent = alert ? AlertDialog : Modal;

  return (
    <DialogComponent
      isOpen={visible}
      onClose={onDialogDismiss}
      style={[
        Platform.select({
          default: {},
          web: {
            width: '100%',
            maxWidth: 560,
            alignSelf: 'center',
          },
        }),
        style,
      ]}
      leastDestructiveRef={cancelRef} //TODO: add only for AlertDialog
      {...restProps}
    >
      <DialogComponent.Content style={contentStyle}>
        {showClose && <DialogComponent.CloseButton />}
        {!isEmpty(title) && (
          <DialogComponent.Header>{title}</DialogComponent.Header>
        )}
        {content && (
          <DialogComponent.Body style={bodyStyle}>
            {typeof content === 'string' ? (
              <Text>{content ?? ''}</Text>
            ) : (
              React.createElement(content as any, {
                onOkClick,
                onCancelClick,
                isPerformingAction,
              })
            )}
          </DialogComponent.Body>
        )}
        {actions &&
          React.createElement(actions, {
            onOkClick,
            onCancelClick,
            isPerformingAction,
          })}
        {showActions && (
          <DialogComponent.Footer>
            <Button.Group space={5}>
              {showCancel && (
                <Button
                  key={'cancel'}
                  disabled={isPerformingAction}
                  onPress={onCancelClick}
                  ref={cancelRef}
                >
                  {cancelTitle}
                </Button>
              )}
              <Button
                key={'ok'}
                disabled={isPerformingAction}
                isLoading={isPerformingAction}
                onPress={onOkClick}
                colorScheme={alert ? 'danger' : 'primary'}
              >
                {okTitle}
              </Button>
            </Button.Group>
          </DialogComponent.Footer>
        )}
      </DialogComponent.Content>
    </DialogComponent>
  );
};

export type ModalDialogRef = {
  show: (props: ModalDialogProps) => void;
};

const ModalDialogRoot = forwardRef<ModalDialogRef, any>((props, ref) => {
  const [currentProps, setCurrentProps] = useState<ModalDialogProps[]>([]);

  const handleDismiss = useCallback(
    (props: ModalDialogProps) => () => {
      setCurrentProps(currentProps.filter((e) => e !== props));
      props.onDismiss?.();
    },
    [currentProps],
  );

  useImperativeHandle(ref, () => ({
    show: (props) => {
      setCurrentProps((state) => [...state, props]);
    },
  }));

  return (
    <>
      {currentProps.map((e) => {
        return <ModalDialogView {...e} onDismiss={handleDismiss(e)} />;
      })}
    </>
  );
});

export type ModalDialogActions = {
  show: (props: ModalDialogProps) => void;
  showAsPromise: (
    props: Omit<ModalDialogProps, 'onOk' | 'onCancel'> & {
      action: () => Promise<boolean>;
    },
  ) => Promise<boolean>;
};

function createModalDialogRef() {
  let current: ModalDialogActions;
  return {
    get current() {
      return current;
    },
    set current(value) {
      current = value;
    },
    show: (props: ModalDialogProps) => {
      current?.show(props);
    },
    showAsPromise: (
      props: Omit<ModalDialogProps, 'onOk' | 'onCancel'> & {
        action: () => Promise<boolean>;
      },
    ) => {
      return new Promise<boolean>((resolve) => {
        current?.show({
          ...omit(props, 'action'),
          onOk: async () => {
            const result = await props.action();
            resolve(result);
            return result;
          },
          onCancel: () => {
            resolve(false);
            return true;
          },
        });
      });
    },
  };
}

export const ModalDialog = createModalDialogRef();

const ModalDialogContext = createContext<ModalDialogActions>({} as any);

export function ModalDialogProvider({ children }) {
  return (
    <ModalDialogContext.Provider
      value={{
        show: (props) => {
          ModalDialog.show(props);
        },
        showAsPromise: (props) => {
          return ModalDialog.showAsPromise(props);
        },
      }}
    >
      {children}
      <ModalDialogRoot ref={ModalDialog} />
    </ModalDialogContext.Provider>
  );
}
