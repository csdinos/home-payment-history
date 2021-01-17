import Joi from 'joi'
import {ErrorReport} from 'joi'
import {HttpError} from '@appRoot/errors'

export const UpdatePaymentSchema = Joi.object({
  'contractId': Joi.number(),
  'description': Joi.string(),
  'value': Joi.number(),
  'time': Joi.date(),
  'isImported': Joi.boolean()
})
  // at least one needed to update
  .or(
    'contractId',
    'description',
    'value',
    'time',
    'isImported'
  )
  .error((errors: Array<ErrorReport>) => {
    throw new HttpError(`Validation error: ${errors.toString()}`, {status: 400})
  })