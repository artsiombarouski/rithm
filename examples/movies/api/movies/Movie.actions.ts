import { BaseService, service } from '@artsiombarouski/rn-core';
import { NavigationService } from '../../services/Navigation.service';

@service()
export class MovieActions extends BaseService {
  onMovieClicked(movieId: string) {
    this.getService(NavigationService).navigate(`/movies/${movieId}`);
  }
}
