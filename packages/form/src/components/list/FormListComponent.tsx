import { FormElementRenderProps, FormValues } from '../../types';
import { FormError } from '../FormError';
import { FormHelper } from '../FormHelper';
import { FormListDialog } from './FormListDialog';
import _, { cloneDeep } from 'lodash';
import { Button, VStack } from 'native-base';
import { IVStackProps } from 'native-base/lib/typescript/components/primitives/Stack/VStack';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';

export type FormListItemRenderProps<TItem extends FormValues = FormValues> = {
  item: TItem;
  update: (values: Partial<TItem>) => void;
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

export type FormListActionsProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  onPress: () => void;
  addItem: (item: Partial<TItem>) => void;
};

export type FormListComponentProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  mode?: 'inline' | 'modal';
  actions?: (props: FormListActionsProps<TItem>) => React.ReactElement;
  placeholder?: string | React.ReactElement;
  renderItem: (props: FormListItemRenderProps<TItem>) => React.ReactElement;
  renderForm: (
    props: FormListFormRenderProps<TItem, TFormValues>,
  ) => React.ReactElement;
  renderProps: FormElementRenderProps<TFormValues>;
  listItemContainerProps?: IVStackProps;
  helperText?: string;
  keepErrorSpace?: boolean;
  showHelper?: boolean;
  showError?: boolean;
};

export function FormListComponent<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
>(props: FormListComponentProps<TItem, TFormValues>) {
  const {
    mode = 'modal',
    actions,
    placeholder,
    renderProps,
    listItemContainerProps,
    showHelper = true,
    showError = true,
    keepErrorSpace = true,
    helperText,
  } = props;
  const ref = useRef<any>();
  const currentValue: TItem[] = renderProps.field.value ?? [];
  const [isItemFormVisible, setItemFormVisible] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState<
    TItem | null | undefined
  >();

  const handleAdd = useCallback(() => {
    setCurrentEditingItem(null);
    setItemFormVisible(true);
  }, []);
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
  const handleUpdate = useCallback(
    (item, values) => {
      Object.assign(item, values);
      renderProps.field.onChange(currentValue);
      setCurrentEditingItem(null);
      setItemFormVisible(false);
    },
    [currentValue, renderProps.field],
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
          update: (values) => handleUpdate(item, values),
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

  const canRenderInlineForm =
    isItemFormVisible && mode === 'inline' && !currentEditingItem;

  return (
    <View style={[styles.container]}>
      <VStack {...listItemContainerProps}>
        {_.isEmpty(currentValue) && !canRenderInlineForm && placeholder}
        {currentValue.map(renderItemRow)}
        {canRenderInlineForm && renderInlineForm()}
      </VStack>
      {(helperText || keepErrorSpace) && showHelper && (
        <FormHelper helperText={helperText} />
      )}
      {showError && <FormError error={renderProps.fieldState?.error} />}
      {actions ? (
        React.createElement(actions, {
          onPress: handleAdd,
          addItem: (item) => {
            renderProps.field.onChange([
              ...(renderProps.field.value ?? []),
              item,
            ]);
          },
        })
      ) : (
        <Button onPress={handleAdd}>Add element</Button>
      )}
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
