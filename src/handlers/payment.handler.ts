import {Express, Request, Response} from 'express'
import {Container} from 'inversify'
import bodyParser from 'body-parser'
import {createValidator} from 'express-joi-validation'
import {PaymentController} from '@appRoot/controllers'
import {
  CreatePaymentSchema,
  IdentifierPaymentSchema,
  UpdatePaymentSchema,
  PaymentHistorySchema
} from '@appRoot/validation'

export const registerPaymentHandlers = (app: Express, container: Container) => {
  const paymentController: PaymentController = container.get(PaymentController)
  const jsonBodyParser = bodyParser.json()
  const validator = createValidator()

  app.get(
    '/payment/history/',
    [
      jsonBodyParser,
      validator.body(PaymentHistorySchema)
    ],
    paymentController.getPaymentHistory.bind(paymentController)
  )

  app.get(
    '/payment/:id',
    [validator.params(IdentifierPaymentSchema)],
    paymentController.getPayment.bind(paymentController)
  )

  app.delete(
    '/payment/:id',
    [validator.params(IdentifierPaymentSchema)],
    paymentController.deletePayment.bind(paymentController)
  )

  app.post(
    '/payment/',
    [
      jsonBodyParser,
      validator.body(CreatePaymentSchema),
    ],
    paymentController.createPayment.bind(paymentController)
  )

  app.put(
    '/payment/:id',
    [
      jsonBodyParser,
      validator.params(IdentifierPaymentSchema),
      validator.body(UpdatePaymentSchema),
    ],
    paymentController.updatePayment.bind(paymentController)
  )
}