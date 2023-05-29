import { NavigationService } from '../Navigation.service';
import { useService } from '@artsiombarouski/rn-core';

export function useNavigationService(): NavigationService {
  return useService(NavigationService);
}
