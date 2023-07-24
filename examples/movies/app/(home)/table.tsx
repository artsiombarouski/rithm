import { TableEmpty } from '../../components/TableEmpty';
import { Pagination, Table } from '@artsiombarouski/rn-components';
import { Box, ChevronRightIcon } from 'native-base';
import { useState } from 'react';

const TablePage = () => {
  const totalPages = 50;
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <Box flex={1}>
      <Table
        columns={[
          {
            key: 'id',
            flex: 0.5,
            title: 'Id',
          },
          {
            key: 'title',
            title: 'Title',
            flex: 1,
            tooltipText: 'Tooltip'
          },
          {
            key: 'inner.title',
            title: 'Inner Title',
            flex: 1,
          },
          {
            key: 'actions',
            title: () => <Box width={4} />,
            render: () => <ChevronRightIcon />,
          },
        ]}
        data={[...Array(20).keys()].map((key) => ({
          id: `i${key + currentPage * 10}`,
          title: `Title of I${key + currentPage * 10}`,
          inner: {
            title: `Inner ${key + currentPage * 10}`,
          },
        }))}
        // data={[]}
        listProps={{
          ListEmptyComponent: <TableEmpty />,
        }}
        flex={1}
        overflow={'hidden'}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPage={(page) => {
          setCurrentPage(page);
        }}
        onNext={() => {
          setCurrentPage(currentPage + 1);
        }}
        onPrevious={() => {
          setCurrentPage(currentPage - 1);
        }}
        hasNext={currentPage < totalPages}
        hasPrevious={currentPage > 1}
        wrapperProps={{
          alignSelf: 'flex-end',
        }}
      />
    </Box>
  );
};

export default TablePage;
