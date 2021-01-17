import Joi, {ErrorReport} from 'joi'
import {HttpError} from '@appRoot/errors'

export const IdentifierPaymentSchema = Joi.object({
  'id': Joi.number().required(),
})
  .error((errors: Array<ErrorReport>) => {
    throw new HttpError(`Validation error: ${errors.toString()}`, {status: 400})
  })