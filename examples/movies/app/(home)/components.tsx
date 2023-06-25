import { Heading, VStack } from 'native-base';
import { Avatar, Pagination } from '@artsiombarouski/rn-components';
import { useState } from 'react';

const Components = () => {
  const totalPages = 50;
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <VStack flex={1} p={6} space={'xs'}>
      <Heading size={'sm'}>Common avatar</Heading>
      <Avatar
        image={
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fHww&w=1000&q=80'
        }
        size={96}
      />
      <Heading size={'sm'}>No Image</Heading>
      <Avatar text={'Artsiom Barouski'} size={96} />
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
      />
    </VStack>
  );
};

export default Components;
