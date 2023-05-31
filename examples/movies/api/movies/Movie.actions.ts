import { BaseService, service } from '@artsiombarouski/rn-services';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';

@service()
export class MovieActions extends BaseService {
  onMovieClicked(movieId: string) {
    this.getService(NavigationService).push(`/movies/${movieId}`);
  }
}
