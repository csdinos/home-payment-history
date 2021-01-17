import knex from 'knex'
import Knex from 'knex'

const connections: Knex[] = []

export function connectToDatabase(database?: string): Knex {
  const conn = knex({
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    }
  })

  connections.push(conn)

  return conn
}

export async function destroyActiveConnections() {
  let conn
  while (conn = connections.pop()) {
    await conn.destroy()
  }
}