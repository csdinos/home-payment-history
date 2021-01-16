import Joi, {ErrorReport} from 'joi'
import {HttpError} from '@appRoot/errors'

export const CreatePaymentSchema = Joi.object({
  "contractId": Joi.number().required(),
  "description": Joi.string().required(),
  "value": Joi.number().required(),
  "time": Joi.date().required(),
  "isImported": Joi.boolean().required()
})
  .error((errors: Array<ErrorReport>) => {
    throw new HttpError(`Validation error: ${errors.toString()}`, {status: 400})
  })