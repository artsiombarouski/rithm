import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useService } from '@artsiombarouski/rn-services';
import { useResourceList } from '@artsiombarouski/rn-resources';
import { observer } from 'mobx-react-lite';
import { MovieItem } from './MovieItem';
import { MovieDiscoverService } from '../../api/movies/MovieDiscover.service';
import { MovieModel } from '../../api/movies/Movie.model';
import { Pagination } from '@artsiombarouski/rn-components/src/pagination';
import { Box, Spinner, VStack } from 'native-base';

export const MoviePagingList = observer(() => {
  const movieResource = useService(MovieDiscoverService);
  const movieList = useResourceList<MovieModel>(movieResource, {
    query: {
      sort_by: 'popularity.desc',
    },
  });

  return (
    <VStack flex={1}>
      <Box flex={1}>
        <FlatList<MovieModel>
          data={movieList.data}
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          numColumns={4}
          renderItem={({ item }) => {
            return <MovieItem data={item} />;
          }}
        />
        {movieList.isLoadingOrInitialLoading && (
          <Box
            flex={1}
            bgColor={'#ffffff'}
            alignItems={'center'}
            justifyContent={'center'}
            style={StyleSheet.absoluteFill}
          >
            <Spinner />
          </Box>
        )}
      </Box>
      <Pagination
        onNext={() => movieList.nextPage()}
        onPrevious={() => movieList.previousPage()}
        hasNext={movieList.hasNext}
        hasPrevious={movieList.hasPrevious}
        onPage={(page) => movieList.goToPage(page)}
        totalPages={movieList.totalPages}
        currentPage={movieList.currentPage}
      />
    </VStack>
  );
});
