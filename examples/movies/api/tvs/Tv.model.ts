import { ResourceModel } from '@rithm/rn-resources';
import { computed } from 'mobx';

export class TvModel extends ResourceModel {
  get name(): string | undefined {
    return this.get('name');
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
}
