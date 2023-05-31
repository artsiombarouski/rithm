import { ServiceContainer } from '@artsiombarouski/rn-core';
import { withServicePersist } from './Persist';
import { MovieActions } from '../api/movies/Movie.actions';
import { MovieService } from '../api/movies/Movie.service';
import { MovieDiscoverService } from '../api/movies/MovieDiscover.service';
import { TvService } from '../api/tvs/Tv.service';
import { TvActions } from '../api/tvs/Tv.actions';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';
import { AppUserStoreService } from './AppUserStoreService';
import { UserScopeService } from './UserScopeService';

export const rootServices = () =>
  new ServiceContainer({
    services: [
      NavigationService,
      withServicePersist('user-state', AppUserStoreService),
    ],
  });

export const scopedServices = () =>
  new ServiceContainer({
    services: [
      UserScopeService,
      MovieService,
      MovieDiscoverService,
      MovieActions,
      TvService,
      TvActions,
    ],
  });
