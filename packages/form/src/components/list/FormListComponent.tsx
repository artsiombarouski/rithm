import { StyleSheet, View } from 'react-native';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FormElementRenderProps, FormValues } from '../../types';
import { Button } from 'react-native-paper';
import { FormListDialog } from './FormListDialog';
import { cloneDeep } from 'lodash';

export type FormListItemRenderProps<TItem extends FormValues = FormValues> = {
  item: TItem;
  edit: () => void;
  remove: () => void;
};

export type FormListFormRenderProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  onSubmit: (values: TFormValues) => void;
  dismiss: () => void;
  initialValues?: TItem;
};

export type FormListComponentProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  mode?: 'inline' | 'modal';
  renderItem: (props: FormListItemRenderProps<TItem>) => React.ReactElement;
  renderForm: (
    props: FormListFormRenderProps<TItem, TFormValues>,
  ) => React.ReactElement;
  renderProps: FormElementRenderProps<TFormValues>;
};

export function FormListComponent<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
>(props: FormListComponentProps<TItem, TFormValues>) {
  const { mode = 'modal', renderItem, renderForm, renderProps } = props;
  const ref = useRef<any>();
  const currentValue: TItem[] = renderProps.field.value ?? [];
  const [isItemFormVisible, setItemFormVisible] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState<
    TItem | null | undefined
  >();

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (currentEditingItem) {
        Object.assign(currentEditingItem, values);
        renderProps.field.onChange(currentValue);
      } else {
        renderProps.field.onChange([...currentValue, values]);
      }
      setCurrentEditingItem(null);
      setItemFormVisible(false);
    },
    [currentValue, currentEditingItem, renderProps.field],
  );
  const handleEdit = useCallback(
    (item: TItem) => {
      setCurrentEditingItem(item);
      setItemFormVisible(true);
    },
    [setCurrentEditingItem],
  );
  const handleRemove = useCallback(
    (item: TItem) => {
      renderProps.field.onChange(currentValue.filter((e) => e !== item));
    },
    [renderProps.field],
  );
  const handleDismiss = useCallback(() => {
    setCurrentEditingItem(null);
    setItemFormVisible(false);
  }, []);

  const renderInlineForm = () => {
    return (
      <View
        ref={ref}
        collapsable={true}
        pointerEvents={'box-none'}
        style={{ width: '100%' }}
      >
        {React.createElement(props.renderForm, {
          onSubmit: handleSubmit,
          dismiss: handleDismiss,
          initialValues: currentEditingItem
            ? cloneDeep(currentEditingItem)
            : undefined,
        })}
      </View>
    );
  };

  const renderItemRow = (item: TItem, index: number) => {
    if (isItemFormVisible && mode === 'inline' && currentEditingItem === item) {
      return renderInlineForm();
    }
    return (
      <Fragment key={index}>
        {React.createElement(props.renderItem, {
          item: item,
          edit: () => handleEdit(item),
          remove: () => handleRemove(item),
        })}
      </Fragment>
    );
  };

  useEffect(() => {
    if (isItemFormVisible && mode === 'inline') {
      ref.current?.scrollIntoView();
    }
  }, [isItemFormVisible]);

  return (
    <View style={[styles.container]}>
      {currentValue.map(renderItemRow)}
      {isItemFormVisible &&
        mode === 'inline' &&
        !currentEditingItem &&
        renderInlineForm()}
      <Button
        onPress={() => {
          setCurrentEditingItem(null);
          setItemFormVisible(true);
        }}
      >
        Add element
      </Button>
      <FormListDialog<TItem, TFormValues>
        listProps={props}
        onSubmit={handleSubmit}
        visible={mode === 'modal' && isItemFormVisible}
        initialValues={currentEditingItem}
        onDismiss={handleDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
