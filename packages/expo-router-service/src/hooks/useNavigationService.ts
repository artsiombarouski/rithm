import { NavigationService } from '../Navigation.service';
import { useService } from '@artsiombarouski/rn-services';

export function useNavigationService(): NavigationService {
  return useService(NavigationService);
}
