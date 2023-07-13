export const AppErrorCodes = {
  Unknown: -1,
};

export class ResourceApiError {
  constructor(
    readonly code: number,
    readonly key: string,
    readonly title: string,
    readonly message: object | string | undefined = undefined,
    readonly payload: any | undefined = undefined,
  ) {}

  static fromApiResponse(data: {
    statusCode?: number;
    key?: string;
    title?: string;
    message?: object | string | undefined;
    payload?: string | undefined;
    // Legacy Api format
    error?: string;
    description?: {
      code: number;
      error?: string;
      description?: string;
    };
  }) {
    const message =
      typeof data.message === 'string'
        ? data.message
        : data?.description?.description ?? 'error.unknown.message';

    return new ResourceApiError(
      data.statusCode ?? data.description?.code ?? AppErrorCodes.Unknown,
      data.key ?? 'unknown',
      data.title ??
        data?.error ??
        data.description?.error ??
        'error.unknown.title',
      message,
      data.payload,
    );
  }

  static unknown = new ResourceApiError(
    AppErrorCodes.Unknown,
    'unknown',
    'error.unknown.title',
    'error.unknown.message',
  );

  toAnalyticsPayload(prefix: string = '') {
    return {
      [`${prefix}code`]: this.code,
      [`${prefix}key`]: this.key,
      [`${prefix}title`]: this.title,
      [`${prefix}message`]: this.message,
      [`${prefix}payload`]: this.payload,
    };
  }
}
