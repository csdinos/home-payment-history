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
        .send(creationData)
        .expect(201)
        .expect((res: Response) => {
          expect(res.body).toMatchObject({
            ...res.body,
            ...creationData
          })
        })
    )
  })
})