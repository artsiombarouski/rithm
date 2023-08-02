import {
  RithmFlatList,
  RithmListRenderItemInfo,
} from '@artsiombarouski/rn-components';
import { Box, Text, View } from 'native-base';
import { useState } from 'react';

export default function RithmListPage() {
  const [allData] = useState(Array(101).fill({}));
  const [data, setData] = useState(allData.slice(0, 20));
  const [isFetching, setFetching] = useState(false);

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
      hasMore={data.length != allData.length}
      // initialLoading={true}
      ListEmptyComponent={
        <Box flex={1} alignItems={'center'} justifyContent={'center'}>
          <Text>Test</Text>
        </Box>
      }
      footer={
        <Box flex={1} p={3} alignItems={'center'}>
          <Text>No more items</Text>
        </Box>
      }
      onEndReached={async () => {
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
