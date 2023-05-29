export type ResourceQueryFilter = { [key: string]: any };

export type ResourceQuery = {
  filter?: ResourceQueryFilter;
  sort?: string[];
  search?: string;
  include?: string[];
  scope?: string[];
  force?: boolean;

  [key: string]: any;
};

export enum ResourcePgMode {
  LimitOffset = 'lo',
  PageToken = 'pt',
}

export interface ResourceListQuery extends ResourceQuery {
  limit?: number;
  offset?: number;
  before?: string;
  after?: string;
  pg_mode?: ResourcePgMode;
}

export interface ResourcePage<T> {
  data: T[];

  meta: {
    count: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    nextPageToken?: string;
    previousPageToken?: string;
  };
}
