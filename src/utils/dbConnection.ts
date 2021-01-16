import knex from 'knex'
import Knex from 'knex'

export function connectToDatabase(): Knex {
  return knex({
    client: 'pg',
    connection: {
      host : process.env.DB_HOST,
      port: 5431,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    }
  })
}