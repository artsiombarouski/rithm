import { MovieModel } from '../../api/movies/Movie.model';
import { observer } from 'mobx-react-lite';
import { Image, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useService } from '@artsiombarouski/rn-services';
import { MovieActions } from '../../api/movies/Movie.actions';

type Props = {
  data: MovieModel;
};

export const MovieItem = observer<Props>((props) => {
  const { data } = props;
  const actions = useService(MovieActions);
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        actions.onMovieClicked(data.id);
      }}
    >
      <Image
        style={{ flex: 1, aspectRatio: 2 / 3 }}
        source={{ uri: data.posterUrl }}
      />
      <Text
        style={{ fontSize: 16, fontWeight: '600', minHeight: 40 }}
        numberOfLines={2}
      >
        {data.title ?? ''}
      </Text>
    </TouchableOpacity>
  );
});
