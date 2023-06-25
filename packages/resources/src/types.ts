import { ResourceQuery } from './api';

export type OptimisticId = string;
export type Id = number | OptimisticId;

export interface CreateOptions {
  optimistic?: boolean;
  path?: string;
}

export interface DestroyOptions {
  path?: string;
  optimistic?: boolean;
  query?: ResourceQuery;
}

export interface SaveOptions {
  path?: string;
  patch?: boolean;
  attributes?: {};
  optimistic?: boolean;
  keepChanges?: boolean;
  query?: ResourceQuery;
}

export interface SetOptions {
  add?: boolean;
  change?: boolean;
  remove?: boolean;
  data?: {};
}

export interface GetOptions {
  required?: boolean;
}

export interface FindOptions {
  required?: boolean;
}

export interface ResourceListMeta {
  page?: number;
  total?: number;
  totalPages?: number;
  nextPageToken?: string;
  previousPageToken?: string;

  [key: string]: any;
}
