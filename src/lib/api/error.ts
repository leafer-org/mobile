export class ApiError<TData = unknown> extends Error {
  public constructor(
    public readonly status: number,
    public readonly data: TData,
  ) {
    super(`API Error: ${status}`);
    this.name = 'ApiError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiErrorWithStatus<TStatus extends number>(
  error: unknown,
  status: TStatus,
): error is ApiError & { status: TStatus } {
  return isApiError(error) && error.status === status;
}
