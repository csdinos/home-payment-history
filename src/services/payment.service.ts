import {inject, injectable} from 'inversify'
import Knex from 'knex'
import * as constants from '@appRoot/constants'
import {Payment} from '@appRoot/types'
import {BaseError} from '@appRoot/errors'

@injectable()
export class PaymentService {
  @inject(constants.LOGGER)
  protected logger: Console
  @inject(constants.DB_CONNECTION)
  protected dbConnection: Knex

  async getPayment(id: string): Promise<Payment> {
    try {
      this.logger.log('PaymentService.getPayment: getting payment by id', {id})

      return await this.dbConnection('payment')
        .where('id', id)
        .whereNull('deletedAt')
        .first()
    } catch (err) {
      throw new BaseError('PaymentService.getPayment: failed getting payment', {
        payload: {data: {id}},
        rootCause: err
      })
    }
  }

  // todo not partial but exclude id and fix return type
  async createPayment(data: Partial<Payment>): Promise<Payment> {
    try {
      this.logger.log('PaymentService.createPayment: creating payment', {data})

      return (await this.dbConnection('payment')
        .insert({
          ...data,
          createdAt: 'NOW()',
          updatedAt: 'NOW()',
        })
        .returning('*'))
        .pop()
    } catch (err) {
      throw new BaseError('PaymentService.getPayment: failed getting payment', {
        payload: {data: {data}},
        rootCause: err
      })
    }
  }

  // todo not partial but exclude id and fix return type
  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    try {
      this.logger.log('PaymentService.updatePayment: updating payment', data)

      return (await this.dbConnection('payment')
        .update({
          ...data,
          updatedAt: 'NOW()',
        })
        .where('id', id)
        .returning('*'))
        .pop()
    } catch (err) {
      throw new BaseError('PaymentService.getPayment: failed updating payment', {
        payload: {data: {id, data}},
        rootCause: err
      })
    }
  }

  async deletePayment(id: string): Promise<Payment[]> {
    try {
      this.logger.log('PaymentService.deletePayment: deleting payment by id', {id})

      const deleteQueryRes = await this.dbConnection('payment')
        .update({
          deletedAt: 'NOW()'
        })
        .where('id', id)
        .whereNull('deletedAt')
        .returning('*')

      if (deleteQueryRes.length > 1) {
        throw new BaseError(
          `Delete operation for id=${id} deleted more than one payments. This should not happen.`,
          {payload: {data: {id}}}
        )
      }

      return deleteQueryRes.pop()
    } catch (err) {
      if (err instanceof BaseError) {
        throw err
      }

      throw new BaseError('PaymentService.deletePayment: failed deleting payment', {
        payload: {data: {id}},
        rootCause: err
      })
    }
  }
}