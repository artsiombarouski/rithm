import React, { useState } from 'react';
import { ActivityIndicator, Button, FlatList, View } from 'react-native';
import { useService } from '@artsiombarouski/rn-services';
import { useResourceList } from '@artsiombarouski/rn-resources';
import { observer } from 'mobx-react-lite';
import { MovieItem } from './MovieItem';
import { MovieDiscoverService } from '../../api/movies/MovieDiscover.service';
import { MovieModel } from '../../api/movies/Movie.model';
import { Checkbox, HStack, VStack } from 'native-base';

export const MovieList = observer(() => {
  const movieResource = useService(MovieDiscoverService);
  const [orderPopularityDesc, setOrderPopularityDesc] = useState(true);
  const movieList = useResourceList<MovieModel>(movieResource, {
    query: {
      sort_by: `popularity.${orderPopularityDesc ? 'desc' : 'asc'}`,
    },
  });

  const renderLoader = () => {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  };

  const renderLoadMore = () => {
    return (
      <View>
        <Button
          onPress={() => {
            movieList.next().then((ignore) => {});
          }}
          title={'Load more'}
        />
      </View>
    );
  };

  return (
    <VStack flex={1}>
      <HStack>
        <Checkbox
          value={''}
          isChecked={orderPopularityDesc}
          onChange={(value) => {
            setOrderPopularityDesc(value);
          }}
        >
          Popularity in DESC order?
        </Checkbox>
      </HStack>
      <FlatList<MovieModel>
        data={movieList.data}
        style={{ flex: 1 }}
        numColumns={4}
        onEndReached={() => {
          movieList.next();
        }}
        ListFooterComponent={
          movieList.isLoading
            ? renderLoader
            : movieList.hasNext
            ? renderLoadMore
            : undefined
        }
        renderItem={({ item }) => {
          return <MovieItem data={item} />;
        }}
      />
    </VStack>
  );
});
