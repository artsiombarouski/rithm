import { RithmFlatList, RithmListRenderItemInfo } from '@artsiombarouski/rn-components';
import { Box, Text, View } from 'native-base';
import { useEffect, useState } from 'react';

export default function RithmListPage() {
  const [allData] = useState(Array(101).fill({}));
  const [data, setData] = useState<any[]>([]);
  const [isFetching, setFetching] = useState(true);
  const [isInitialFetched, setInitialFetched] = useState(false);

  useEffect(() => {
    let mounted = true;
    setTimeout(() => {
      if (mounted) {
        setData(allData.slice(0, 20));
        setInitialFetched(true);
        setFetching(false);
      }
    }, 3000);
    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = ({ index }: RithmListRenderItemInfo<any>) => {
    return (
      <View
        style={{
          flex: 1,
          aspectRatio: 1,
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text>Item {index}</Text>
      </View>
    );
  };

  return (
    <RithmFlatList
      numColumns={3}
      renderItem={renderItem}
      spacing={8}
      data={data}
      hasMore={data.length !== allData.length && isInitialFetched}
      initialLoading={isFetching && data.length === 0}
      ListEmptyComponent={
        <Box flex={1} alignItems={'center'} justifyContent={'center'}>
          <Text>Test</Text>
        </Box>
      }
      footer={
        <Box flex={1} p={3} alignItems={'center'}>
          <Text>(footer) No more items</Text>
        </Box>
      }
      onEndReached={async () => {
        console.log('onEndReached');
        if (isFetching) {
          return;
        }
        if (data.length < allData.length) {
          setFetching(true);
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          setData((prevState) => {
            const newSlice = allData.slice(
              prevState.length,
              prevState.length + 20,
            );
            return [...prevState, ...newSlice];
          });
          setFetching(false);
        }
      }}
      keyExtractor={(item, index) => `item-${index}`}
    />
  );
}
