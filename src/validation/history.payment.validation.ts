import Joi, {ErrorReport} from 'joi'
import {HttpError} from '@appRoot/errors'

export const PaymentHistorySchema = Joi.object({
  'contractId': Joi.number().required(),
  'startDate': Joi.date().required(),
  'endDate': Joi.date().required()
})
  .error((errors: Array<ErrorReport>) => {
    throw new HttpError(`Validation error: ${errors.toString()}`, {status: 400})
  })