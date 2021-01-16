import {CreatePaymentSchema} from '@appRoot/validation'
import {validateOptions} from '@appRoot/validation/__tests__/test-utils'

describe('create payment validation scenarios', () => {
  const data = {
    contractId: 123123,
    description: 'I am a very descriptive description, I am telling you!',
    value: 1994,
    time: '2016-12-09T12:57:31.393Z',
    isImported: true
  }

  it('When given valid data, it should pass with no errors', () => {
    try {
      const res = CreatePaymentSchema.validate(data, validateOptions)
      expect(res.error).toStrictEqual(undefined)
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  it('When missing required data, it should fail', () => {
    try {
      const _data = {...data}
      delete _data.contractId
      delete _data.value

      const res = CreatePaymentSchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" is required,"value" is required]')
    }
  })

  it('When data types are invalid, it should fail', () => {
    try {
      const _data = {
        contractId: 'ninety two',
        description: 54,
        value: '2016-12-09T12:57:31.393Z',
        time: '1111112016-12-09T12:57:31.393Z',
        isImported: 'truee'
      }

      const res = CreatePaymentSchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" must be a number,"description" must be a string,"value" must be a number,"time" must be a valid date,"isImported" must be a boolean]')
    }
  })

  it('When the time field is not a proper date, it should fail', () => {
    try {
      const _data = {...data}
      _data.time = 'October 22 of 2019'

      const res = CreatePaymentSchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "time" must be a valid date]')
    }
  })

  it('When missing all data, it should fail', () => {
    try {
      const res = CreatePaymentSchema.validate({}, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" is required,"description" is required,"value" is required,"time" is required,"isImported" is required]')
    }
  })
})