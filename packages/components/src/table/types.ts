import { ReactElement } from 'react';
import { IBoxProps } from 'native-base';

export type TableColumn<TItem> = Pick<IBoxProps, 'width'> & {
  key: string;
  title?: string | (() => ReactElement);
  flex?: number;
  render?: (item: TItem) => ReactElement;
};
