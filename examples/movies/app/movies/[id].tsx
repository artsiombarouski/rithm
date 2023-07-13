import React from 'react';
import { Image, Text } from 'react-native';
import { useService } from '@artsiombarouski/rn-services';
import { MovieService } from '../../api/movies/Movie.service';
import { useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useResourceModel } from '@artsiombarouski/rn-resources';
import { Box, Heading, VStack } from 'native-base';

const MovieInfo = observer(() => {
  const { id } = useLocalSearchParams();
  const movieResource = useService(MovieService);
  const { model } = useResourceModel(parseInt(id as any), movieResource.store);

  return (
    <VStack space={'md'} p={4}>
      <Image
        source={{ uri: model.posterUrl }}
        style={{
          aspectRatio: 2 / 3,
          width: 400,
        }}
      />
      <Heading size={'md'}>{model.title}</Heading>
      <Text>{model.overview}</Text>
      <VStack>
        <Heading size={'sm'}>Genres</Heading>
        {model?.genres?.map((genre) => {
          return <Text key={genre.id}>{genre.name}</Text>;
        })}
      </VStack>
      <VStack>
        <Heading size={'sm'}>Collection</Heading>
        {model?.collection && (
          <Box>
            <Text>{model.collection!.name}</Text>
          </Box>
        )}
      </VStack>
    </VStack>
  );
});

export default MovieInfo;
