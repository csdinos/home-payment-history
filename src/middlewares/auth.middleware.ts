import {NextFunction, Request, Response} from 'express'
import auth from 'basic-auth'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const creds = auth(req)

  if (!creds || creds.name != process.env.BASIC_AUTH_NAME || creds.pass != process.env.BASIC_AUTH_PASS) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic')
    res.end('Access denied')

    return
  }

  next()
}