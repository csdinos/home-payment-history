import {startApp} from '../../src/app'
import * as request from 'supertest'
import {Response} from 'supertest'
import {destroyTestDb, initTestDb} from '../test-utils'
import {paymentSeedData} from '../../seeds/data/payment'
import {StartedTestContainer} from 'testcontainers'

describe('delete payment endpoint scenarios', () => {

  let container: StartedTestContainer

  beforeAll(async () => {
    container = await initTestDb()
  })

  afterAll(async () => {
    await destroyTestDb(container)
  })

  it('When I try to delete an existing paymenta, I should get 200 with the deleted payment', async () => {
    const expectedPayment = paymentSeedData[2]
    return (await request
        .agent(startApp())
        .delete(`/payment/3`)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.deletedAt).toBeDefined()
          expect(res.body).toMatchObject({
            ...res.body,
            ...expectedPayment,
            deletedAt: expect.anything()
          })
        })
    )
  })

  it('When I try to delete a NOT existing payment, I should get 404', async () => {
    return (await request
        .agent(startApp())
        .delete(`/payment/123456`)
        .expect(404)
        .expect((res: Response) => {
          expect(res.body.message).toEqual('Not found')
        })
    )
  })
})