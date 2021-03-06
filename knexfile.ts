require('dotenv').config()

module.exports = {
  client: "postgresql",
  connection: {
    database: process.env.DB_DATABASE,
    user:  process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
}
