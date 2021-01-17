import {startApp} from '../../src/app'
import * as request from 'supertest'
import {Response} from 'supertest'
import {destroyTestDb, initTestDb} from '../test-utils'
import {StartedTestContainer} from 'testcontainers'
import {paymentSeedData} from '../../seeds/data/payment'

describe('Payment history endpoint scenarios', () => {

  let container: StartedTestContainer

  beforeAll(async () => {
    container = await initTestDb()
  })

  afterAll(async () => {
    await destroyTestDb(container)
  })

  it('When requesting the payment history (all payments), it should retrieve a correct history according the request data', async () => {
    const requestData = {
      contractId: 17689,
      startDate: '2010-12-09T00:00:00.000Z',
      endDate: '2021-01-20T00:00:00.000Z'
    }
    return (await request
        .agent(startApp())
        .get('/payment/history')
        .send(requestData)
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.sum).toEqual(-30)
          expect(res.body.items.length).toEqual(4)
          expect(res.body.items).toMatchSnapshot()
        })
    )
  })

  it('When requesting the payment history with dates matching no payments, it should retrieve an empty list with 0 sum', async () => {
    const requestData = {
      contractId: 17689,
      startDate: '2010-12-09T00:00:00.000Z',
      endDate: '2011-01-20T00:00:00.000Z'
    }
    return (await request
        .agent(startApp())
        .get('/payment/history')
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .send(requestData)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.sum).toEqual(0)
          expect(res.body.items.length).toEqual(0)
        })
    )
  })

  it('When requesting the payment history with contractId matching no payments, it should retrieve an empty list with 0 sum', async () => {
    const requestData = {
      contractId: 999,
      startDate: '2010-12-09T00:00:00.000Z',
      endDate: '2021-01-20T00:00:00.000Z'
    }
    return (await request
        .agent(startApp())
        .get('/payment/history')
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .send(requestData)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.sum).toEqual(0)
          expect(res.body.items.length).toEqual(0)
        })
    )
  })

  it('When requesting payment history with dates equal as one record, it should include it in the response', async () => {
    const expectedPayment = paymentSeedData[0]
    const requestData = {
      contractId: expectedPayment.contractId,
      startDate: expectedPayment.time,
      endDate: expectedPayment.time
    }
    return (await request
        .agent(startApp())
        .get('/payment/history')
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .send(requestData)
        .expect(200)
        .expect((res: Response) => {
          expect(res.body.sum).toEqual(expectedPayment.value)
          expect(res.body.items.length).toEqual(1)
          expect(res.body.items).toMatchObject([{
            ...expectedPayment
          }])
        })
    )
  })

  it('After deleting a payment on the range of the request, it should not include it in the history', async () => {
    const requestData = {
      contractId: 17689,
      startDate: '2010-12-09T00:00:00.000Z',
      endDate: '2021-01-20T00:00:00.000Z'
    }
    return (await request
        .agent(startApp())
        .delete('/payment/1')
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .expect(200)
        .expect(async () => {
          return (await request
              .agent(startApp())
              .get('/payment/history')
              .send(requestData)
              .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
              .expect(200)
              .expect((res: Response) => {
                expect(res.body.sum).toEqual(-130)
                expect(res.body.items.length).toEqual(3)
                expect(res.body.items).toMatchSnapshot()
              })
          )
        })
    )
  })
})