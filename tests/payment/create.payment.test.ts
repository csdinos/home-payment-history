import {startApp} from '../../src/app'
import * as request from 'supertest'
import {Response} from 'supertest'
import {destroyTestDb, initTestDb} from '../test-utils'
import {StartedTestContainer} from 'testcontainers'

describe('Create payment endpoint scenarios', () => {

  let container: StartedTestContainer

  beforeAll(async () => {
    container = await initTestDb()
  })

  afterAll(async () => {
    await destroyTestDb(container)
  })

  it('When I try to create a payment with valid data, i should get 200 with the created payment', async () => {
    const creationData = {
      contractId: 123456,
      description: 'much describe, very description, wow',
      value: 1000,
      time: '2010-01-09T15:06:00.000Z',
      isImported: true
    }

    return (await request
      .agent(startApp())
      .post('/payment/')
      .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
      .send(creationData)
      .expect(201)
      .expect(async (res: Response) => {
        const {id} = res.body
        const createdPayment = res.body

        expect(res.body).toMatchObject({
          ...res.body,
          ...creationData
        })

        return (await request
          .agent(startApp())
          .get(`/payment/${id}`)
          .auth(process.env.BASIC_AUTH_NAME, process.env.BASIC_AUTH_PASS)
          .expect(200)
          .expect((res: Response) => {
            expect(res.body).toMatchObject({
              ...createdPayment
            })
          }))
      })
    )
  })
})