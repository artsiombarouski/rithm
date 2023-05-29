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
import { useResourceList } from '@rithm/rn-resources/src/hooks/UseResourceList.hook';
import { observer } from 'mobx-react-lite';
import { TvService } from '../api/tvs/Tv.service';
import { TvModel } from '../api/tvs/Tv.model';
import { TvActions } from '../api/tvs/Tv.actions';

export const TvList = observer(() => {
  const tvService = useService(TvService);
  const tvActions = useService(TvActions);
  const tvList = useResourceList(() => {
    return tvService.createDiscoveryList({
      sort_by: 'popularity.desc',
    });
  });

  useEffect(() => {
    if (tvList.isInitialLoaded) {
      return;
    }
    tvList.fetch().then((result) => {
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
            tvList.next().then((ignore) => {});
          }}
          title={'Load more'}
        />
      </View>
    );
  };

  return (
    <FlatList<TvModel>
      data={tvList.data}
      style={{ flex: 1 }}
      numColumns={4}
      onEndReached={() => {
        console.log('onEndReached');
      }}
      ListFooterComponent={
        tvList.isLoading
          ? renderLoader
          : tvList.hasNext
          ? renderLoadMore
          : undefined
      }
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              tvActions.onTvClicked(item.id);
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
              {item.name ?? ''}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
});
