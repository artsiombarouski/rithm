import { Resource, ResourceApi } from '@artsiombarouski/rn-resources';
import { MovieDbConfig } from '../MovieDbConfig';
import { GenreModel } from './GenreModel';
import { service } from '@artsiombarouski/rn-services';

@service()
export class GenreResource extends Resource<GenreModel> {
  constructor() {
    super(() => GenreModel, ResourceApi.create(MovieDbConfig.genreUrl));
  }
}
