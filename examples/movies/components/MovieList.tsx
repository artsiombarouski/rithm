import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useService } from '@rithm/rn-core';
import { useResourceList } from '@rithm/rn-resources';
import { observer } from 'mobx-react-lite';
import { MovieDiscoverService } from '../api/movies/MovieDiscover.service';
import { MovieModel } from '../api/movies/Movie.model';
import { MovieActions } from '../api/movies/Movie.actions';

export const MovieList = observer(() => {
  const movieResource = useService(MovieDiscoverService);
  const movieActions = useService(MovieActions);
  const movieList = useResourceList(() => {
    return movieResource.createList({
      sort_by: 'popularity.desc',
    });
  });

  useEffect(() => {
    if (movieList.isInitialLoaded) {
      return;
    }
    movieList.fetch().then((result) => {
      //ignore
    });
  }, []);

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
    <FlatList<MovieModel>
      data={movieList.data}
      style={{ flex: 1 }}
      numColumns={4}
      onEndReached={() => {
        console.log('onEndReached');
      }}
      ListFooterComponent={
        movieList.isLoading
          ? renderLoader
          : movieList.hasNext
          ? renderLoadMore
          : undefined
      }
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              movieActions.onMovieClicked(item.id);
            }}
          >
            <Image
              style={{ flex: 1, aspectRatio: 2 / 3 }}
              source={{ uri: item.posterUrl }}
            />
            <Text
              style={{ fontSize: 16, fontWeight: '600', minHeight: 40 }}
              numberOfLines={2}
            >
              {item.title ?? ''}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
});
