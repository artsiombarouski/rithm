import { Resource } from '@artsiombarouski/rn-resources/src/Resource';
import { ResourceApi } from '@artsiombarouski/rn-resources';
import { service } from '@artsiombarouski/rn-core';
import { MovieModel } from './Movie.model';
import { MovieDbConfig } from '../MovieDbConfig';

@service()
export class MovieService extends Resource<MovieModel> {
  constructor() {
    super(() => MovieModel, ResourceApi.create(MovieDbConfig.movieUrl));
  }
}
