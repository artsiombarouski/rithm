import { Axios, AxiosResponse } from 'axios';
import {
  defaultResourceApiConfig,
  ResourceApiConfig,
} from './ResourceApiConfig';
import { ResourceListQuery, ResourcePage, ResourceQuery } from './types';
import { ResourceApiResponse } from './ResourceApiResponse';

export class ResourceApi<T = Object> {
  private readonly config: ResourceApiConfig;

  static create<T = any>(
    path: string,
    config?: Partial<ResourceApiConfig>,
  ): ResourceApi<T> {
    return new ResourceApi<T>(path, config);
  }

  constructor(readonly path: string, config?: Partial<ResourceApiConfig>) {
    this.config = {
      ...defaultResourceApiConfig,
      ...config,
    };
  }

  get transport(): Axios {
    return this.config.transport;
  }

  clone(path?: string, config?: Partial<ResourceApiConfig>): ResourceApi<T> {
    return new ResourceApi<T>(path ?? this.path, config ?? this.config);
  }

  list(
    query?: ResourceListQuery,
  ): Promise<ResourceApiResponse<ResourcePage<T>>> {
    const url = this.buildUrl(this.path, query);
    return this.config.transport
      .get(url)
      .then((res) => this.transformMany(res))
      .catch((res) => this.transformError<ResourcePage<T>>(res));
  }

  get(resourceId: any, query?: ResourceQuery): Promise<ResourceApiResponse<T>> {
    return this.getRpc({ url: `${this.path}/${resourceId}`, query });
  }

  getRest<D = T>(
    path: string,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<D>> {
    return this.getRpc({ url: `${this.path}${path}`, query });
  }

  getRpc<D = T>(params: {
    url: string;
    query?: ResourceQuery;
  }): Promise<ResourceApiResponse<D>> {
    const targetUrl = this.buildUrl(params.url, params.query);
    return this.config.transport
      .get(targetUrl)
      .then((res) => this.transformOne<D>(res))
      .catch((res) => this.transformError<D>(res));
  }

  post(data: Object, query?: ResourceQuery): Promise<ResourceApiResponse<T>> {
    return this.postRpc({ url: this.path, data, query });
  }

  postRest<D = T>(
    path: string,
    data: Object,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<D>> {
    return this.postRpc({ url: `${this.path}${path}`, data, query });
  }

  postRpc<D = T>(params: {
    url: string;
    data: {};
    query?: ResourceQuery;
    headers?: { [key: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    const url = this.buildUrl(params.url, params.query);
    return this.config.transport
      .post(url, params.data, {
        headers: params.headers,
      })
      .then((res) => this.transformOne<D>(res))
      .catch((res) => this.transformError<D>(res));
  }

  patch(
    resourceId: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.patchRpc({ url: `${this.path}/${resourceId}`, data, query });
  }

  patchRest<D = T>(
    resourcePath: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.patchRpc({ url: `${this.path}${resourcePath}`, data, query });
  }

  patchRpc<D = T>(params: {
    url: string;
    data: {};
    query?: ResourceQuery;
    headers?: { [key: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    const url = this.buildUrl(params.url, params.query);
    return this.config.transport
      .patch(url, params.data, { headers: params.headers })
      .then((res) => this.transformOne<D>(res))
      .catch((res) => this.transformError<D>(res));
  }

  put(
    resourceId: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.putRpc({ url: `${this.path}/${resourceId}`, data, query });
  }

  putRest<D = T>(
    resourcePath: any,
    data: {},
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.putRpc({ url: `${this.path}${resourcePath}`, data, query });
  }

  putRpc<D = T>(params: {
    url: string;
    data: {};
    query?: ResourceQuery;
    headers?: { [key: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    const url = this.buildUrl(params.url, params.query);
    return this.config.transport
      .put(url, params.data, { headers: params.headers })
      .then((res) => this.transformOne<D>(res))
      .catch((res) => this.transformError<D>(res));
  }

  destroy(
    resourceId: any,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.destroyRpc({ url: `${this.path}/${resourceId}`, query });
  }

  destroyRest(
    resourcePath: any,
    query?: ResourceQuery,
  ): Promise<ResourceApiResponse<T>> {
    return this.destroyRpc({ url: `${this.path}${resourcePath}`, query });
  }

  destroyRpc<D = T>(params: {
    url: string;
    query?: ResourceQuery;
    headers?: { [key: string]: any };
  }): Promise<ResourceApiResponse<D>> {
    const url = this.buildUrl(params.url, params.query);
    return this.config.transport
      .delete(url, { headers: params.headers })
      .then((res) => this.transformOne<D>(res))
      .catch((res) => this.transformError<D>(res));
  }

  private async transformOne<D = T>(
    res: AxiosResponse,
  ): Promise<ResourceApiResponse<D>> {
    const data = await this.config.transformer.transformOne<D>(res);
    return new ResourceApiResponse<D>(data as D, undefined);
  }

  private async transformMany<D = T>(
    res: AxiosResponse,
  ): Promise<ResourceApiResponse<ResourcePage<D>>> {
    const data = await this.config.transformer.transformMany<D>(res);
    return new ResourceApiResponse<ResourcePage<D>>(data, undefined);
  }

  async transformError<D = T>(error: any): Promise<ResourceApiResponse<D>> {
    const data = await this.config.transformer.transformError(error);
    return new ResourceApiResponse<D>(undefined, data);
  }

  private buildUrl = (
    url: string,
    query?: ResourceQuery & ResourceListQuery,
  ) => {
    let targetUrl = `${url}`;
    const options = this.config.transformer.transformQuery(query);
    if (options) {
      if (!targetUrl.includes('?')) {
        targetUrl += '?';
      }
      targetUrl += Object.entries(options)
        .map(([k, v], index) => {
          const result = `${k}=${v}`;
          if (index > 0) {
            return `&${result}`;
          }
          return result;
        })
        .join('');
    }
    return targetUrl;
  };
}
