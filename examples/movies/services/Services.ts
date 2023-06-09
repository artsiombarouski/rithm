import {
  ServiceContainer,
  withServicePersist,
} from '@artsiombarouski/rn-services';
import { MovieActions } from '../api/movies/Movie.actions';
import { MovieService } from '../api/movies/Movie.service';
import { MovieDiscoverService } from '../api/movies/MovieDiscover.service';
import { TvService } from '../api/tvs/Tv.service';
import { TvActions } from '../api/tvs/Tv.actions';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';
import { UserScopeService } from './UserScopeService';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';
import { GenreResource } from '../api/genres/GenreResource';
import { CollectionResource } from '../api/collections/CollectionResource';

export const rootServices = () =>
  new ServiceContainer({
    services: [
      NavigationService,
      withServicePersist('user-state', UserStoreService),
    ],
  });

export const scopedServices = () =>
  new ServiceContainer({
    services: [
      UserScopeService,
      MovieService,
      MovieDiscoverService,
      MovieActions,
      GenreResource,
      CollectionResource,
      TvService,
      TvActions,
    ],
  });
