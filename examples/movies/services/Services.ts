import { CollectionResource } from '../api/collections/CollectionResource';
import { GenreResource } from '../api/genres/GenreResource';
import { MovieActions } from '../api/movies/Movie.actions';
import { MovieService } from '../api/movies/Movie.service';
import { MovieDiscoverService } from '../api/movies/MovieDiscover.service';
import { TvActions } from '../api/tvs/Tv.actions';
import { TvService } from '../api/tvs/Tv.service';
import { UserScopeService } from './UserScopeService';
import { initializeFirebaseAnalytics } from '@artsiombarouski/rn-analytics-firebase';
import { NavigationService } from '@artsiombarouski/rn-expo-router-service';
import {
  ServiceContainer,
  withServicePersist,
} from '@artsiombarouski/rn-services';
import { UserStoreService } from '@artsiombarouski/rn-user-store-service';

const firebaseConfig =
  'eyJhcGlLZXkiOiJBSXphU3lDM1NWa3E3b0pwY29KYmpicHRGUUZMbjVzMUdFeTd3RG8iLCJhdXRoRG9tYWluIjoibW92aWVzLWY3MWIxLmZpcmViYXNlYXBwLmNvbSIsInByb2plY3RJZCI6Im1vdmllcy1mNzFiMSIsInN0b3JhZ2VCdWNrZXQiOiJtb3ZpZXMtZjcxYjEuYXBwc3BvdC5jb20iLCJtZXNzYWdpbmdTZW5kZXJJZCI6IjE0NDM0OTAyODM1MCIsImFwcElkIjoiMToxNDQzNDkwMjgzNTA6d2ViOjNlNjY3MGY2YzVkZTI5ZDA5OTJhYWYiLCJtZWFzdXJlbWVudElkIjoiRy03Uk02OEdKOEJYIn0=';

initializeFirebaseAnalytics(firebaseConfig);

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
