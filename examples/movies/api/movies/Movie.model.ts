import { ResourceModel } from '@artsiombarouski/rn-resources';
import { computed } from 'mobx';

export class MovieModel extends ResourceModel {
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
}
