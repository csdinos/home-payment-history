import {startApp} from '../../src/app'
import * as request from 'supertest'
import {Response} from 'supertest'
import {destroyTestDb, initTestDb} from '../test-utils'
import {paymentSeedData} from '../../seeds/data/payment'
import {StartedTestContainer} from 'testcontainers'

describe('Update payment endpoint scenarios', () => {

  let container: StartedTestContainer

  beforeAll(async () => {
    container = await initTestDb()
  })

  afterAll(async () => {
    await destroyTestDb(container)
  })

  it('When I try to update an existing payment, I should get 200 with the updated payment', async () => {
    const paymentToUpdate = paymentSeedData[1]
    const dataToUpdate = {
      value: 100,
      description: 'Ich spreche kein deutch :('
    }

    return (await request
        .agent(startApp())
        .put(`/payment/2`)
        .send((dataToUpdate))
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .expect(200)
        .expect(async (res: Response) => {
          const updatedPayment = res.body
          expect(res.body).toMatchObject({
            ...paymentToUpdate,
            ...res.body,
            ...dataToUpdate
          })

          return (await request
              .agent(startApp())
              .get(`/payment/2`)
              .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
              .expect(200)
              .expect((res: Response) => {
                expect(res.body).toMatchObject({
                  ...updatedPayment
                })
              })
          )
        })
    )
  })

  it('When I try to update all the fields of an existing payment, I should get 200 with the updated payment', async () => {
    const paymentToUpdate = paymentSeedData[1]
    const dataToUpdate = {
      contractId: 121212,
      description: 'Ich komme aus FETA',
      value: 1250,
      time: '2021-01-01T15:06:00.000Z',
      isImported: false
    }

    return (await request
        .agent(startApp())
        .put(`/payment/2`)
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .send(dataToUpdate)
        .expect(200)
        .expect(async (res: Response) => {
          const updatedPayment = res.body
          expect(res.body).toMatchObject({
            ...paymentToUpdate,
            ...res.body,
            ...dataToUpdate
          })

          return (await request
              .agent(startApp())
              .get(`/payment/2`)
              .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
              .expect(200)
              .expect((res: Response) => {
                expect(res.body).toMatchObject({
                  ...updatedPayment
                })
              })
          )
        })
    )
  })

  it('When I try to update a NOT existing payment, I should get 404', async () => {
    return (await request
        .agent(startApp())
        .put(`/payment/123456`)
        .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
        .send({value: 100})
        .expect(404)
        .expect((res: Response) => {
          expect(res.body.message).toEqual('Not found')
        })
    )
  })
})