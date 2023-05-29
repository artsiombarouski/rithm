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
}

class ApiTransformer extends ResourceApiDefaultTransformer {
  transformQuery(
    query?: ResourceQuery & ResourceListQuery,
  ): { [p: string]: any } | undefined {
    const result = super.transformQuery(query) ?? {};
    if (query?.after) {
      delete result['after'];
      result['page'] = query.after;
    }
    return result;
  }

  transformMany<T>(
    response: AxiosResponse,
  ): Promise<ResourcePage<T>> | ResourcePage<T> {
    const { page, results, total_pages, total_results } = response.data;
    return {
      data: results,
      meta: {
        count: total_results,
        hasNextPage: page < total_pages,
        hasPreviousPage: page > 1,
        nextPageToken: page < total_pages ? `${page + 1}` : undefined,
        previousPageToken: page > 1 ? `${page - 1}` : undefined,
      },
    };
  }
}

const networkTransport = axios.create({
  baseURL: MovieDbConfig.baseUrl,
  headers: {
    Authorization: `Bearer ${MovieDbConfig.apiKey}`,
  },
});

defaultResourceApiConfig.transport = networkTransport;
defaultResourceApiConfig.transformer = new ApiTransformer();
