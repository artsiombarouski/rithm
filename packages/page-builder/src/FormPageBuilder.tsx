import React from 'react';
import {
  FormElementRenderProps,
  FormItem,
  FormItemProps,
  FormValues,
} from '@artsiombarouski/rn-form';
import { HStack, VStack } from 'native-base';
import { PageBuilderList, PageBuilderListProps } from './ui';
import { v4 as uuidv4 } from 'uuid';
import { ImageElement, TextElement, VideoElement } from './elements';
import { PageBuilderElement } from './types';
import { ElementButton } from './ui/ElementButton';
import { useFieldArray } from 'react-hook-form';

export type FormPageBuilderProps<T extends FormValues = FormValues> =
  FormItemProps<T> &
    Partial<PageBuilderListProps> & {
      elements?: { [key: string]: PageBuilderElement<any> };
    };

export const FormPageBuilder = (props: FormPageBuilderProps) => {
  const { elements: externalElements, ...restProps } = props;

  const elements = {
    [TextElement.type]: TextElement,
    [ImageElement.type]: ImageElement,
    [VideoElement.type]: VideoElement,
    ...externalElements,
  };

  const renderList = (
    props: PageBuilderListProps,
    renderProps: FormElementRenderProps,
  ) => {
    const { fields, append, move, remove } = useFieldArray({
      keyName: 'key',
      name: renderProps.field.name,
    });
    return (
      <VStack>
        <PageBuilderList
          {...props}
          key={'page-builder-list'}
          data={fields as any}
          onMove={move}
          onRemove={remove}
          elements={elements}
          namePrefix={renderProps.field.name}
        />
        <HStack space={'md'}>
          {Object.values(elements).map((element) => {
            return (
              <ElementButton
                key={element.type}
                onPress={() => {
                  append({
                    key: uuidv4(),
                    type: element.type,
                  });
                }}
                icon={element.icon}
                title={element.title}
              />
            );
          })}
        </HStack>
      </VStack>
    );
  };

  return <FormItem<PageBuilderListProps> {...restProps} render={renderList} />;
};
