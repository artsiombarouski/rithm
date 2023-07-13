import { Resource, ResourceApi } from '@artsiombarouski/rn-resources';
import { CollectionModel } from './CollectionModel';
import { MovieDbConfig } from '../MovieDbConfig';
import { service } from '@artsiombarouski/rn-services';

@service()
export class CollectionResource extends Resource<CollectionModel> {
  constructor() {
    super(
      () => CollectionModel,
      ResourceApi.create(MovieDbConfig.collectionUrl),
    );
  }
}
