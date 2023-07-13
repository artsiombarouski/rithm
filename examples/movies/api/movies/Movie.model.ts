import {
  model,
  ResourceAttributes,
  ResourceModel,
  ResourceModelStore,
} from '@artsiombarouski/rn-resources';
import { computed } from 'mobx';
import { CollectionModel } from '../collections/CollectionModel';
import { GenreModel } from '../genres/GenreModel';

@model()
export class MovieModel extends ResourceModel {
  constructor(
    store: ResourceModelStore<MovieModel>,
    attributes: ResourceAttributes = {},
  ) {
    super(store, attributes, {
      belongs_to_collection: {
        store: (register) => register.get(CollectionModel),
      },
      genres: {
        store: (register) => register.get(GenreModel),
      },
    });
  }

  get title(): string | undefined {
    return this.get('title');
  }

  get overview(): string | undefined {
    return this.get('overview');
  }

  @computed
  get backgroundUrl(): string | undefined {
    const image = this.get('backdrop_path');
    if (!image) {
      return;
    }
    return `https://image.tmdb.org/t/p/w500${image}`;
  }

  @computed
  get posterUrl(): string | undefined {
    const image = this.get('poster_path');
    if (!image) {
      return;
    }
    return `https://image.tmdb.org/t/p/w500${image}`;
  }

  get isAdult(): boolean {
    return this.get('adult') === true;
  }

  get collection() {
    return this.get<CollectionModel>('belongs_to_collection');
  }

  get genres() {
    return this.get<GenreModel[]>('genres');
  }
}
