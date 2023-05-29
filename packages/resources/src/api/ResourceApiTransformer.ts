import { ResourceListQuery, ResourcePage, ResourceQuery } from './types';
import { AxiosResponse } from 'axios';
import { ResourceApiError } from './ResourceApiError';

export abstract class ResourceApiTransformer {
  abstract transformQuery(
    query?: ResourceQuery & ResourceListQuery,
  ): { [key: string]: any } | undefined;

  abstract transformOne<T = Object>(response: AxiosResponse): Promise<T> | T;

  abstract transformMany<T = Object>(
    response: AxiosResponse,
  ): Promise<ResourcePage<T>> | ResourcePage<T>;

  abstract transformError<T = Object>(error: any): ResourceApiError;
}
