import React from 'react';
import { View } from 'react-native';
import { MoviePagingList } from '../../components/movies/MoviePagingList';

const Movie = () => {
  return (
    <View style={{ flex: 1 }}>
      <MoviePagingList />
    </View>
  );
};

export default Movie;
