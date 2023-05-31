import { BaseService, service } from '../../../../packages/services';
import { Resource, ResourceApi, ResourceModelStore } from '@artsiombarouski/rn-resources';
import { MovieModel } from './Movie.model';
import { MovieDbConfig } from '../MovieDbConfig';
import { MovieService } from './Movie.service';

export interface MovieDiscoverService extends BaseService {}

@service()
export class MovieDiscoverService extends Resource<MovieModel> {
  constructor() {
    super(() => MovieModel, ResourceApi.create(MovieDbConfig.movieDiscoverUrl));
  }

  get store(): ResourceModelStore<MovieModel> {
    return this.getService(MovieService).store;
  }
}
