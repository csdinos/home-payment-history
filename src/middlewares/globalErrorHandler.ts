import {NextFunction, Request, Response} from 'express'
import {parseError} from '@appRoot/utils'
import {HttpError} from '@appRoot/errors'
import {getContainer} from '@appRoot/container'
import * as constants from '@appRoot/constants'

export const globalErrorHandler = (err: Error, req?: Request, res?: Response, next?: NextFunction) => {
  const logger: Console = getContainer().get(constants.LOGGER)

  logger.log(parseError(err))

  if (res) {
    if (err instanceof HttpError) {
      res.status(err.status)
        .send({
          message: err.error_message
        })
    } else {
      res.status(500)
        .send({
          ...parseError(err)
        })
    }
  }

}