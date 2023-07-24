import { IBoxProps, ITextProps } from 'native-base';
import { ReactElement, ReactNode } from 'react';

export type TableColumn<TItem> = Pick<IBoxProps, 'width'> & {
  key: string;
  title?: string | (() => ReactElement);
  flex?: number;
  render?: (item: TItem) => ReactElement;
  titleProps?: ITextProps;
  valueProps?: ITextProps;
  tooltipText?: string;
  tooltipIcon?: ReactNode;
};
