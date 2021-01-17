import 'reflect-metadata'
import express from 'express'
import {Express} from 'express'
import bodyParser from 'body-parser'
import {setUpContainer} from '@appRoot/container'
import {registerPaymentHandlers} from '@appRoot/handlers'
import {globalErrorHandler, setHeaders, authenticate} from '@appRoot/middlewares'

export const startApp = (): Express => {
  const app: Express = express()
  const appContainer = setUpContainer(console)

  app.use(authenticate)
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(setHeaders)

  registerPaymentHandlers(app, appContainer)

  app.use(globalErrorHandler)

  return app
}