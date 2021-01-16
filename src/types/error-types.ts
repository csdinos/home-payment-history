export type ParsedRootCause = {
  error: {
    message: string,
    stack: string
    raw?: Error
  },
}

export interface BaseErrorData {
  payload?: object,
  rootCause?: Error
}

export type HttpErrorData = BaseErrorData & { status?: number }