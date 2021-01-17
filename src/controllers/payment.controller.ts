import {inject, injectable} from 'inversify'
import * as constants from '@appRoot/constants'
import {PaymentService} from '@appRoot/services'
import {NextFunction, Request, Response} from 'express'
import {HistoryRequestData, Payment, PaymentRequestData} from '@appRoot/types'
import {HttpError} from '@appRoot/errors'
import {PaymentHistory} from '@appRoot/types/PaymentHistory'

@injectable()
export class PaymentController {
  @inject(constants.LOGGER)
  protected logger: Console

  @inject(PaymentService)
  protected paymentService: PaymentService

  async getPayment(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params

    this.logger.log(`PaymentController.getPayment: preparing to fetch payment`, {id})

    try {
      const payment: Payment = (await this.paymentService.getPayment(id))

      if (!payment) {
        return next(new HttpError('Not found', {status: 404, payload: {id}}))
      }

      res.send(payment)
    } catch (err) {
      return next(new HttpError(`PaymentController.getPayment: failed to fetch payment`, {
        rootCause: err,
        payload: {
          data: req.params
        }
      }))
    }
  }

  async deletePayment(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params

    this.logger.log(`PaymentController.deletePayment: preparing to delete payment`, {id})

    try {
      const payment = (await this.paymentService.deletePayment(id))

      if (!payment) {
        return next(new HttpError('Not found', {status: 404, payload: {id}}))
      }

      res.send(payment)
    } catch (err) {
      return next(new HttpError(`PaymentController.deletePayment: failed to delete payment`, {
        rootCause: err,
        payload: {
          data: req.params
        }
      }))
    }
  }

  async createPayment(req: Request, res: Response, next: NextFunction) {
    const data: PaymentRequestData = req.body

    this.logger.log(`PaymentController.createPayment: preparing to create payment`, {data})

    try {
      const payment: Payment = (await this.paymentService.createPayment(data))

      res.status(201).send(payment)
    } catch (err) {
      return next(new HttpError(`PaymentController.getPayment: failed to craete payment`, {
        rootCause: err,
        payload: {
          data: req.body
        }
      }))
    }
  }

  async updatePayment(req: Request, res: Response, next: NextFunction) {
    const data: PaymentRequestData = req.body
    const {id} = req.params

    this.logger.log(`PaymentController.updatePayment: preparing to update payment`, {id, data})

    try {
      const payment: Payment = (await this.paymentService.updatePayment(id, data))

      if (!payment) {
        return next(new HttpError('Not found', {status: 404, payload: {id, data}}))
      }

      res.send(payment)
    } catch (err) {
      return next(new HttpError(`PaymentController.updatePayment: failed to update payment`, {
        rootCause: err,
        payload: {
          data: req.body
        }
      }))
    }
  }

  async getPaymentHistory(req: Request, res: Response, next: NextFunction) {
    const data: HistoryRequestData = req.body

    this.logger.log(`PaymentController.getPaymentHistory: preparing to get payment history`, {data})

    try {
      const payments: Array<Payment> = (await this.paymentService.getPaymentHistory(data))
      const paymentHistory: PaymentHistory = PaymentController.buildPaymentHistory(payments)

      res.send(paymentHistory)
    } catch (err) {
      return next(new HttpError(`PaymentController.getPaymentHistory: failed to get payment history`, {
        rootCause: err,
        payload: {
          data: req.body
        }
      }))
    }
  }

  // Note to self: static because it does not touch/adapt the state of the class, not sure though whether it should still be static or not
  private static buildPaymentHistory(payments: Array<Payment>): PaymentHistory {
    return {
      items: payments,
      sum: payments.map(p => p.value).reduce((sum, val) => sum + val, 0)
    }
  }

}