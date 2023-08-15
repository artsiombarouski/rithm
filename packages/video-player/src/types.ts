export class VideoError {
  constructor(
    readonly code: number,
    readonly key: string,
    readonly title: string,
    readonly message: string | undefined = undefined,
    readonly payload: any | undefined = undefined,
  ) {}

  static unknown = new VideoError(
    -1,
    'unknown',
    'error.unknown.title',
    'error.unknown.message',
  );
}
