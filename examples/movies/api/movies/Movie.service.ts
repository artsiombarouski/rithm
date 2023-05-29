import { Resource } from '@rithm/rn-resources/src/Resource';
import { ResourceApi } from '@rithm/rn-resources';
import { service } from '@rithm/rn-core';
import { MovieModel } from './Movie.model';
import { MovieDbConfig } from '../MovieDbConfig';

@service()
export class MovieService extends Resource<MovieModel> {
  constructor() {
    super(() => MovieModel, ResourceApi.of(MovieDbConfig.movieUrl));
  }
}
