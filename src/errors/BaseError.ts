import {parseError} from '@appRoot/utils'
import {BaseErrorData, ParsedRootCause} from '@appRoot/types'

// todo types
export class BaseError extends Error {
  public error_message: string
  public payload: object
  public root_cause: Error
  public root_cause_parsed: ParsedRootCause

  constructor(message: string, data?: BaseErrorData) {
    super(message)

    const {rootCause, payload} = data

    this.name = 'BaseError'
    this.root_cause_parsed = parseError(rootCause)
    this.payload = payload
    this.root_cause = rootCause
    this.error_message = `${message}`

    Error.captureStackTrace(this, BaseError)
    Object.setPrototypeOf(this, BaseError.prototype)
  }
}