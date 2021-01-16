import {BaseError} from '@appRoot/errors'
import {HttpErrorData} from '@appRoot/types'


export class HttpError extends BaseError {
  public status: number

  constructor(message: string, data?: HttpErrorData) {
    super(message, data)

    const {status} = data
    this.status = status || 500
    this.name = 'HttpError'

    // todo clean
    Error.captureStackTrace(this, HttpError)
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}