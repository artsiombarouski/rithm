import { ResourceApiError } from './ResourceApiError';

export class ResourceApiResponse<T> {
  constructor(
    readonly data: T | undefined,
    readonly error: ResourceApiError | undefined = undefined,
  ) {}
}
