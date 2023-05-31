import React from 'react';
import { View } from 'react-native';
import { MovieList } from '../../components/MovieList';

const Movie = () => {
  return (
    <View style={{ flex: 1 }}>
      <MovieList />
    </View>
  );
};

export default Movie;
