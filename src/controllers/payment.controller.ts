import {inject, injectable} from 'inversify'
import * as constants from '@appRoot/constants'
import {PaymentService} from '@appRoot/services'
import {NextFunction, Request, Response} from 'express'
import {Payment} from '@appRoot/types'
import {HttpError} from '@appRoot/errors'

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
    const data = req.body

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
    const data = req.body
    const {id} = req.params

    this.logger.log(`PaymentController.updatePayment: preparing to update payment`, {id, data})

    try {
      const payment: Payment = (await this.paymentService.updatePayment(id, data))

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

}