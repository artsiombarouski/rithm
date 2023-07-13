import { ResourceApiDefaultTransformer } from '@artsiombarouski/rn-resources/src/api/ResourceApiDefaultTransform';
import {
  defaultResourceApiConfig,
  ResourceListQuery,
  ResourcePage,
  ResourceQuery,
} from '@artsiombarouski/rn-resources';
import axios, { AxiosResponse } from 'axios/index';

export class MovieDbConfig {
  static readonly apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZTg2OWFhODE1MTBmYWUzYjZlOGEyNTg2MTBlODRmNSIsInN1YiI6IjY0NmRjZWYyNTFlNmFiMDEwMDg0Nzk5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.OCQieazTw9Y46KVfbYAfXgHxrK8wTro89Qi3Iegh32A';
  static readonly baseUrl = 'https://api.themoviedb.org/3';
  static readonly tvUrl = 'tv';
  static readonly tvDiscoverUrl = 'discover/tv';
  static readonly movieUrl = 'movie';
  static readonly movieDiscoverUrl = 'discover/movie';
  static readonly collectionUrl = 'collection';
  static readonly genreUrl = 'genre';
}

class ApiTransformer extends ResourceApiDefaultTransformer {
  transformQuery(
    query?: ResourceQuery & ResourceListQuery,
  ): string | undefined {
    const { after, before, ...restQuery } = query ?? {};
    const result = {
      ...restQuery,
    };
    if (after) {
      result['page'] = after;
    } else if (before) {
      result['page'] = before;
    }
    return ResourceApiDefaultTransformer.mapToQueryString(result);
  }

  transformMany<T>(
    response: AxiosResponse,
  ): Promise<ResourcePage<T>> | ResourcePage<T> {
    const { page, results, total_pages, total_results } = response.data;
    const totalPages = Math.min(500, total_pages); // movies db
    return {
      data: results,
      meta: {
        page: page,
        count: total_results,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPageToken: page < totalPages ? `${page + 1}` : undefined,
        previousPageToken: page > 1 ? `${page - 1}` : undefined,
      },
    };
  }
}

const networkTransport = axios.create({
  baseURL: MovieDbConfig.baseUrl,
});

defaultResourceApiConfig.transport = networkTransport;
defaultResourceApiConfig.transformer = new ApiTransformer();
