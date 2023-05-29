import React from 'react';
import { View } from 'react-native';
import { MovieList } from '../../components/MovieList';

const Movies = () => {
  return (
    <View style={{ flex: 1 }}>
      <MovieList />
    </View>
  );
};

export default Movies;
