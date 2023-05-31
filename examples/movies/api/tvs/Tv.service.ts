import { service } from '@artsiombarouski/rn-core';
import {
  Resource,
  ResourceApi,
  ResourceList,
  ResourceListQuery,
} from '@artsiombarouski/rn-resources';
import { TvModel } from './Tv.model';
import { MovieDbConfig } from '../MovieDbConfig';

@service()
export class TvService extends Resource<TvModel> {
  constructor() {
    super(() => TvModel, ResourceApi.create(MovieDbConfig.tvUrl));
  }

  createDiscoveryList(query?: ResourceListQuery): ResourceList<TvModel> {
    return new ResourceList<TvModel>(
      this.api.clone(MovieDbConfig.tvDiscoverUrl),
      this.store,
      query,
    );
  }
}
