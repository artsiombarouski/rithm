import { AxiosError, AxiosResponse } from 'axios';
import { ResourceApiError } from './ResourceApiError';
import { ResourceListQuery, ResourcePage, ResourceQuery } from './types';
import { ResourceApiTransformer } from './ResourceApiTransformer';

export class ResourceApiDefaultTransformer extends ResourceApiTransformer {
  transformQuery(
    query?: ResourceQuery & ResourceListQuery,
  ): { [key: string]: any } | undefined {
    if (!query) {
      return;
    }
    const {
      filter,
      search,
      sort,
      include,
      scope,
      limit,
      offset,
      force,
      pg_mode,
      before,
      after,
      ...restQueryParameters
    } = query;
    const transformed: any = {
      ...restQueryParameters,
    };
    if (filter) {
      transformed.filter = JSON.stringify(filter);
    }
    if (search) {
      transformed.search = search;
    }
    if (sort) {
      transformed.sort = sort.join(',');
    }
    if (include) {
      transformed.include = include.join(',');
    }
    if (scope) {
      transformed.scope = scope.join(',');
    }
    if (limit) {
      transformed.limit = limit;
    }
    if (offset) {
      transformed.offset = offset;
    }
    if (force) {
      transformed.force = force;
    }
    if (pg_mode) {
      transformed.pg_mode = pg_mode;
    }
    if (before) {
      transformed.before = before;
    }
    if (after) {
      transformed.after = after;
    }
    return transformed;
  }

  transformOne<T = Object>(response: AxiosResponse): Promise<T> | T {
    return response.data as T;
  }

  transformMany<T>(
    response: AxiosResponse,
  ): Promise<ResourcePage<T>> | ResourcePage<T> {
    const { data, meta } = response.data;
    return {
      data: data,
      meta: meta,
    };
  }

  transformError<T>(error: any): ResourceApiError {
    if (error instanceof AxiosError && error.response?.data) {
      return new ResourceApiError(
        error.response.status,
        error.response.statusText,
        error.response.data?.error,
        error.response.data?.message,
        error.response.data,
      );
    }
    return ResourceApiError.unknown;
  }
}
