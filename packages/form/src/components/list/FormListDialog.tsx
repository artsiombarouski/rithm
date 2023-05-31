import React from 'react';
import { FormValues } from '../../types';
import { Dialog, Portal } from 'react-native-paper';
import {
  FormListComponentProps,
  FormListFormRenderProps,
} from './FormListComponent';
import { cloneDeep } from 'lodash';

export type FormListDialogProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  visible: boolean;
  onDismiss: () => void;
  listProps: FormListComponentProps<TItem, TFormValues>;
  onSubmit: (values: FormValues) => void;
  initialValues?: TItem | null | undefined;
};

export function FormListDialog<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
>(props: FormListDialogProps<TItem, TFormValues>) {
  const { listProps, onSubmit, visible, onDismiss, initialValues } = props;

  let content;
  if (visible) {
    const formProps: FormListFormRenderProps<TItem> = {
      initialValues: initialValues ? cloneDeep(initialValues) : undefined,
      dismiss: onDismiss,
      onSubmit: onSubmit,
    };
    content = React.createElement(listProps.renderForm, formProps);
  } else {
    content = <></>;
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Content>{content}</Dialog.Content>
      </Dialog>
    </Portal>
  );
}
