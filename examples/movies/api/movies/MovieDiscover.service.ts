import { BaseService, service } from '@rithm/rn-core';
import { Resource, ResourceApi, ResourceModelStore } from '@rithm/rn-resources';
import { MovieModel } from './Movie.model';
import { MovieDbConfig } from '../MovieDbConfig';
import { MovieService } from './Movie.service';

export interface MovieDiscoverService extends BaseService {}

@service()
export class MovieDiscoverService extends Resource<MovieModel> {
  constructor() {
    super(() => MovieModel, ResourceApi.of(MovieDbConfig.movieDiscoverUrl));
  }

  get store(): ResourceModelStore<MovieModel> {
    return this.getService(MovieService).store;
  }
}
