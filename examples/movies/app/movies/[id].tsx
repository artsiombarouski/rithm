import React from 'react';
import { Image, Text, View } from 'react-native';
import { useService } from '@artsiombarouski/rn-services';
import { MovieService } from '../../api/movies/Movie.service';
import { useSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useResourceModel } from '@artsiombarouski/rn-resources';

const MovieInfo = observer(() => {
  const { id } = useSearchParams();
  const movieResource = useService(MovieService);
  const movie = useResourceModel(parseInt(id as any), movieResource.store);

  return (
    <View>
      <Text>Title:</Text>
      <Image
        source={{ uri: movie.model.posterUrl }}
        style={{
          aspectRatio: 2 / 3,
          width: 400,
        }}
      />
      <Text>{movie.model.title}</Text>
      <Text>{movie.model.overview}</Text>
    </View>
  );
});

export default MovieInfo;
