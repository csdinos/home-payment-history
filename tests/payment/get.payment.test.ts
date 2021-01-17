import {startApp} from '../../src/app'
import * as request from 'supertest'
import {Response} from 'supertest'
import {destroyTestDb, initTestDb} from '../test-utils'
import {paymentSeedData} from '../../seeds/data/payment'
import {StartedTestContainer} from 'testcontainers'

describe('Get payment endpoint scenarios', () => {

  let container: StartedTestContainer

  beforeAll(async () => {
    container = await initTestDb()
  })

  afterAll(async () => {
    await destroyTestDb(container)
  })

  it('When I try to get an existing paymenta, I should get 200 with the payment', async () => {
    const expectedPayment = paymentSeedData[0]
    return (await request
        .agent(startApp())
        .get(`/payment/1`)
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body).toMatchObject({
            ...res.body,
            ...expectedPayment
          })
        })
    )
  })

  it('When I try to get a NOT existing payment, I should get 404', async () => {
    return (await request
        .agent(startApp())
        .get(`/payment/123456`)
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .expect(404)
        .expect((res: Response) => {
          expect(res.body.message).toEqual('Not found')
        })
    )
  })
})