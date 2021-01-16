import {Container} from 'inversify'
import {connectToDatabase} from '@appRoot/utils'
import * as constants from '@appRoot/constants'
import {PaymentController} from '@appRoot/controllers'
import {PaymentService} from '@appRoot/services'

let container: Container = null

// this would normally be another logger, here we use console.log for simplicity
export function setUpContainer(logger: Console): Container {
  logger.log('Creating app container')

  container = new Container({defaultScope: 'Singleton'})

  // contants
  container.bind(constants.DB_CONNECTION).toConstantValue(connectToDatabase())
  container.bind(constants.LOGGER).toConstantValue(console)

  // services
  container.bind(PaymentService).to(PaymentService).inRequestScope()

  // controllers
  container.bind(PaymentController).to(PaymentController).inRequestScope()
  return container
}


export function getContainer(): Container {
  if (!container) {
    throw new Error('Container not initialized')
  }

  return container
}
