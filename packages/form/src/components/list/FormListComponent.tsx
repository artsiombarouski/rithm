import { FormElementRenderProps, FormValues } from '../../types';
import { FormError, FormErrorProps } from '../FormError';
import { FormHelper, FormHelperProps } from '../FormHelper';
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
import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

export type FormListItemRenderProps<TItem extends FormValues = FormValues> = {
  item: TItem;
  index: number;
  itemPath: string;
  update: (values: Partial<TItem>) => void;
  edit: () => void;
  remove: () => void;
  fields: FieldArrayWithId<TItem>[];
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
  TItem extends FormValues | string = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  onPress: () => void;
  addItem: (item: Partial<TItem> | string) => void;
};

export type FormListComponentProps<
  TItem extends FormValues = FormValues,
  TFormValues extends FormValues = FormValues,
> = {
  mode?: 'inline' | 'modal';
  actions?: (props: FormListActionsProps<TItem>) => React.ReactElement;
  placeholder?: string | React.ReactElement;
  renderItem: (props: FormListItemRenderProps<TItem>) => React.ReactElement;
  renderForm?: (
    props: FormListFormRenderProps<TItem, TFormValues>,
  ) => React.ReactElement;
  renderProps: FormElementRenderProps<TFormValues>;
  listItemContainerProps?: IVStackProps;
  keepErrorSpace?: boolean;
  showHelper?: boolean;
  showError?: boolean;
  isSimpleArray?: boolean;
  isFormInitialVisible?: boolean;
  hideActionWhenInlineFormVisible?: boolean;
} & Pick<FormHelperProps, 'helperText' | 'helperProps'> &
  Omit<FormErrorProps, 'error'>;

const generateId = () => {
  const d =
    typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16 + d) % 16 | 0;

    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

type UseFormArrayHelperProps<TItem> = {
  renderProps: FormElementRenderProps<any>;
  isSimpleArray?: boolean;
};

export function useFormArrayHelper<TItem>(
  props: UseFormArrayHelperProps<TItem>,
): Pick<UseFieldArrayReturn<TItem>, 'fields' | 'append' | 'update' | 'remove'> {
  const { renderProps, isSimpleArray } = props;
  if (isSimpleArray) {
    const methods = useFormContext();
    return {
      fields: (renderProps.field.value ?? []).map(() => ({
        id: generateId(),
      })) as any,
      append: (item: any) => {
        const currentValue = methods.getValues(renderProps.field.name);
        const itemsToAdd = Array.isArray(item) ? item : [item];
        renderProps.field.onChange([...currentValue, ...itemsToAdd]);
      },
      update: (index, value) => {
        const currentValue = methods.getValues(renderProps.field.name);
        currentValue[index] = value;
        renderProps.field.onChange(currentValue);
      },
      remove: (index: number | number[]) => {
        const currentValue = methods.getValues(renderProps.field.name);
        const indexesToRemove = Array.isArray(index) ? index : [index];
        renderProps.field.onChange(
          currentValue.filter((e, index) => !indexesToRemove.includes(index)),
        );
      },
    };
  } else {
    return useFieldArray<TItem>({
      name: renderProps.field.name as any,
    });
  }
}

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
    helperProps,
    errorProps,
    isSimpleArray,
    isFormInitialVisible,
    hideActionWhenInlineFormVisible,
  } = props;
  const ref = useRef<any>();
  const context = useFormContext();
  const { fields, append, update, remove } = useFormArrayHelper<TItem>({
    renderProps: renderProps as any,
    isSimpleArray: isSimpleArray,
  });

  const [isItemFormVisible, setItemFormVisible] =
    useState(isFormInitialVisible);
  const [currentEditingItemIndex, setCurrentEditingItemIndex] = useState<
    number | undefined | null
  >(null);

  const handleAdd = useCallback(() => {
    setCurrentEditingItemIndex(null);
    setItemFormVisible(true);
  }, []);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      if (currentEditingItemIndex != null) {
        update(currentEditingItemIndex, values as any);
      } else {
        append(values as any);
      }
      setCurrentEditingItemIndex(null);
      setItemFormVisible(false);
    },
    [fields, currentEditingItemIndex, renderProps.field],
  );

  const handleEdit = useCallback(
    (index: number) => {
      setCurrentEditingItemIndex(index);
      setItemFormVisible(true);
    },
    [setCurrentEditingItemIndex],
  );

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [renderProps.field],
  );

  const handleDismiss = useCallback(() => {
    setCurrentEditingItemIndex(null);
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
          initialValues:
            currentEditingItemIndex != null
              ? cloneDeep(renderProps.field.value[currentEditingItemIndex])
              : undefined,
        })}
      </View>
    );
  };

  const renderItemRow = (item: FieldArrayWithId<TItem>, index: number) => {
    if (
      isItemFormVisible &&
      mode === 'inline' &&
      currentEditingItemIndex === index
    ) {
      return renderInlineForm();
    }
    return (
      <Fragment key={item.id}>
        {React.createElement(props.renderItem, {
          key: item.id,
          item: isSimpleArray ? renderProps.field.value[index] : item,
          index: index,
          itemPath: `${renderProps.field.name}.${index}`,
          fields: fields,
          update: (values) => {
            context.setValue(
              `${renderProps.field.name}.${index}`,
              values as any,
            );
          },
          edit: () => handleEdit(index),
          remove: () => handleRemove(index),
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
    isItemFormVisible && mode === 'inline' && currentEditingItemIndex === null;

  return (
    <View style={[styles.container]}>
      <VStack {...listItemContainerProps}>
        {_.isEmpty(fields) && !canRenderInlineForm && placeholder}
        {fields.map(renderItemRow)}
        {canRenderInlineForm && renderInlineForm()}
      </VStack>
      {(helperText || keepErrorSpace) && showHelper && (
        <FormHelper
          field={renderProps.field as any}
          helperText={helperText}
          {...helperProps}
        />
      )}
      {showError && (
        <FormError error={renderProps.fieldState?.error} {...errorProps} />
      )}
      {(!canRenderInlineForm || !hideActionWhenInlineFormVisible) &&
        (actions ? (
          React.createElement(actions, {
            onPress: handleAdd,
            addItem: (item) => {
              append(item as any);
            },
          })
        ) : (
          <Button onPress={handleAdd}>Add element</Button>
        ))}
      <FormListDialog<TItem, TFormValues>
        listProps={props}
        onSubmit={handleSubmit}
        visible={mode === 'modal' && isItemFormVisible}
        initialValues={
          currentEditingItemIndex != null
            ? renderProps.field.value[currentEditingItemIndex]
            : undefined
        }
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
