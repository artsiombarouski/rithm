import { CollectionResource } from '../api/collections/CollectionResource';
import { GenreResource } from '../api/genres/GenreResource';
import { MovieActions } from '../api/movies/Movie.actions';
import { MovieService } from '../api/movies/Movie.service';
import { MovieDiscoverService } from '../api/movies/MovieDiscover.service';
import { TvActions } from '../api/tvs/Tv.actions';
import { TvService } from '../api/tvs/Tv.service';
import { UserScopeService } from './UserScopeService';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';
import {
  ServiceContainer,
  withServicePersist,
} from '@artsiombarouski/rn-services';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';


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