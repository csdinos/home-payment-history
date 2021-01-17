import {connectToDatabase} from '../src/utils'
import {destroyActiveConnections} from '../src/utils/dbConnection'
import {GenericContainer, StartedTestContainer} from 'testcontainers'

export const initTestDb = async (): Promise<StartedTestContainer> => {
  const dbContainer = await createDbContainer()

  setUpEnvironmentVariables(dbContainer)

  const dbConnection = await connectToDatabase()

  await dbConnection.migrate.rollback()
  await dbConnection.migrate.latest()
  await dbConnection.seed.run()

  return dbContainer
}

export const destroyTestDb = async (dbContainer: StartedTestContainer) => {
  await dbContainer.stop()
  await destroyActiveConnections()
}

const createDbContainer = async () => {
  return new GenericContainer('postgres')
    .withExposedPorts(5432)
    .withEnv('POSTGRES_USER', 'test')
    .withEnv('POSTGRES_PASSWORD', 'test')
    .start()
}

const setUpEnvironmentVariables = (container: StartedTestContainer) => {
  process.env.EXTERNAL_PORT = '3001'
  process.env.DB_USER='test'
  process.env.DB_PASSWORD='test'
  process.env.DB_DATABASE='postgres'
  process.env.DB_PORT = String(container.getMappedPort(5432))
  process.env.DB_HOST= container.getHost()
}