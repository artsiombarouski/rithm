import { BaseService, service } from '@artsiombarouski/rn-core';
import { NavigationService } from '../../services/Navigation.service';

@service()
export class TvActions extends BaseService {
  onTvClicked(tvId: string) {
    this.getService(NavigationService).navigate(`/tvs/${tvId}`);
  }
}
