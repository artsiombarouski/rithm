import { Heading, VStack } from 'native-base';
import { Avatar } from '@artsiombarouski/rn-components';

const Components = () => {
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
    </VStack>
  );
};

export default Components;
