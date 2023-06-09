import { BaseService, service } from '@artsiombarouski/rn-services';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';

@service()
export class TvActions extends BaseService {
  onTvClicked(tvId: string) {
    this.getService(NavigationService).push(`/tvs/${tvId}`);
  }
}
