import { model, ResourceModel } from '@artsiombarouski/rn-resources';

@model()
export class CollectionModel extends ResourceModel {
  get name() {
    return this.get<string>('name');
  }

  get backdropPath() {
    return this.get<string>('backdrop_path');
  }

  get posterPath() {
    return this.get<string>('poster_path');
  }
}
