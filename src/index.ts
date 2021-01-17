process.env.NODE_ENV === 'production' ? require('module-alias/register') : require('dotenv').config()

import {startApp} from '@appRoot/app'
import {destroyActiveConnections} from '@appRoot/utils/dbConnection'

const server = startApp().listen(process.env.EXTERNAL_PORT)
console.log('Let\'s roll')

const releaseResources = async () => {
  await destroyActiveConnections()
  server.close()
}

process.on('SIGINT', releaseResources)
process.on('SIGTERM', releaseResources)