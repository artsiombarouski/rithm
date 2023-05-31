import React from 'react';
import { Image, Text, View } from 'react-native';
import { useService } from '../../../../packages/services';
import { useSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useResourceModel } from '@artsiombarouski/rn-resources/src/hooks/UseResourceModel.hook';
import { TvService } from '../../api/tvs/Tv.service';

const MovieInfo = observer(() => {
  const { id } = useSearchParams();
  const tvResource = useService(TvService);
  const tv = useResourceModel(parseInt(id as any), tvResource.store);

  return (
    <View>
      <Text>Title:</Text>
      <Image
        source={{ uri: tv.model.posterUrl }}
        style={{
          aspectRatio: 2 / 3,
          width: 400,
        }}
      />
      <Text>{tv.model.name}</Text>
      <Text>{tv.model.overview}</Text>
    </View>
  );
});

export default MovieInfo;
