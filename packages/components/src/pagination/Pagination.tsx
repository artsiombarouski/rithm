import {
  Box,
  Button,
  ChevronLeftIcon,
  ChevronRightIcon,
  HStack,
  IBoxProps,
  IButtonProps,
  IconButton,
  IIconButtonProps,
  ITextProps,
  Text,
  useTheme,
} from 'native-base';
import { IHStackProps } from 'native-base/lib/typescript/components/primitives/Stack/HStack';

export type PaginationProps = Pick<IButtonProps, 'size'> & {
  onNext?: () => void;
  onPrevious?: () => void;
  onPage?: (page: number) => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  currentPage?: number;
  totalPages?: number;
  arrowProps?: IIconButtonProps;
  pageProps?: IButtonProps;
  selectedPageProps?: IButtonProps;
  wrapperProps?: IHStackProps;
};

export const Pagination = (props: PaginationProps) => {
  const {
    onNext,
    onPrevious,
    onPage,
    hasNext = false,
    hasPrevious = false,
    currentPage,
    totalPages,
    arrowProps,
    pageProps,
    selectedPageProps,
    size = 8,
    wrapperProps,
  } = props;
  const theme = useTheme();
  const targetArrowProps: IIconButtonProps = {
    size: 'sm',
    borderWidth: 1,
    borderColor: theme.colors.primary['500'],
    p: 0,
    h: size,
    minW: size,
    ...arrowProps,
  };
  const targetPageProps: IButtonProps = {
    size: 'sm',
    variant: 'outline',
    p: 1,
    h: size,
    minW: size,
    ...pageProps,
  };
  const targetSelectedPageProps: IButtonProps = {
    ...targetPageProps,
    variant: 'solid',
    backgroundColor: theme.colors.primary['500'],
    ...selectedPageProps,
  };
  const dotContainerProps: IBoxProps = {
    minW: size,
    minH: size,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const dotsProps: ITextProps = {
    textAlign: 'center',
    lineHeight: 0,
  };

  const renderPage = (page: number) => {
    const isSelected = page === currentPage;
    return (
      <Button
        key={`page-${page}`}
        onPress={() => onPage?.(page)}
        {...(isSelected ? targetSelectedPageProps : targetPageProps)}
      >
        {page.toString()}
      </Button>
    );
  };

  const renderEllipsis = (key: string) => {
    return (
      <Box key={key} {...dotContainerProps}>
        <Text {...dotsProps}>•••</Text>
      </Box>
    );
  };

  const maxPages = 10;
  const pagesToRender = [];

  if (onPage && currentPage && totalPages) {
    if (totalPages <= maxPages) {
      for (let i = 0; i < totalPages; i++) {
        pagesToRender.push(renderPage(1 + i));
      }
    } else {
      let pageBufferSize = 2;
      let left = Math.max(1, currentPage - pageBufferSize);
      let right = Math.min(currentPage + pageBufferSize, totalPages);
      if (currentPage - 1 <= pageBufferSize) {
        right = 1 + pageBufferSize * 2;
      }
      if (totalPages - currentPage <= pageBufferSize) {
        left = totalPages - pageBufferSize * 2;
      }
      for (let i = left; i <= right; i += 1) {
        pagesToRender.push(renderPage(i));
      }
      if (currentPage - 1 >= pageBufferSize + 2 && currentPage !== 1 + 2) {
        pagesToRender.unshift(renderEllipsis('ellipsis-previous'));
      }
      if (
        totalPages - currentPage >= pageBufferSize * 2 &&
        currentPage !== totalPages - 2
      ) {
        pagesToRender.push(renderEllipsis('ellipsis-next'));
      }

      if (left !== 1) {
        pagesToRender.unshift(renderPage(1));
      }
      if (right !== totalPages) {
        pagesToRender.push(renderPage(totalPages));
      }
    }
  }

  return (
    <HStack alignItems={'center'} space={3} p={1} {...wrapperProps}>
      <IconButton
        key={'pg-arrow-left'}
        icon={<ChevronLeftIcon />}
        onPress={onPrevious}
        {...targetArrowProps}
        isDisabled={!hasPrevious}
      />
      {pagesToRender.length > 0 && <HStack space={2}>{pagesToRender}</HStack>}
      <IconButton
        key={'pg-arrow-right'}
        icon={<ChevronRightIcon />}
        {...targetArrowProps}
        onPress={onNext}
        isDisabled={!hasNext}
      />
    </HStack>
  );
};
