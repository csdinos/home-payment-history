import * as Knex from 'knex'

export async function up(knex: Knex): Promise<Knex.SchemaBuilder> {
  const paymentIdSequence = (): Knex.SchemaBuilder => {
    return knex.schema.raw('CREATE SEQUENCE payment_id_seq')
  }

  const setDefaultSequence = (): Knex.SchemaBuilder => {
    return knex.schema
      .raw('ALTER TABLE payment ALTER id SET DEFAULT NEXTVAL(\'payment_id_seq\')')
  }
  const createPaymentTable = (): Knex.SchemaBuilder => {
    return knex.schema.createTable('payment', (t) => {
      t.integer('id').primary()
      t.integer('contractId') // would normally link to a contract table
      t.string('description')
      t.integer('value')
      t.boolean('isImported')
      t.dateTime('time')
      t.dateTime('createdAt')
      t.dateTime('updatedAt')
      t.dateTime('deletedAt')
    })
  }

  return createPaymentTable().then(paymentIdSequence).then(setDefaultSequence)
}


export async function down(knex: Knex): Promise<Knex.SchemaBuilder> {
  const dropPaymentTable = () => {
    return knex.schema.dropTable('payment')
  }

  return dropPaymentTable()
}
