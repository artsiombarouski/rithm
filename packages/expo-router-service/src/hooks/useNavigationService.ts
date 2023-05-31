import { NavigationService } from '../Navigation.service';
import { useService } from '../../../services';

export function useNavigationService(): NavigationService {
  return useService(NavigationService);
}
