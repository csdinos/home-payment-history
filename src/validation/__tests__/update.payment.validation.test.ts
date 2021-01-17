import {UpdatePaymentSchema} from '@appRoot/validation'
import {validateOptions} from '@appRoot/validation/__tests__/test-utils'

describe('update payment validation scenarios', () => {
  const data = {
    contractId: 123123,
    description: 'I am a very descriptive description, I am telling you!',
    value: 1994,
    time: '2016-12-09T12:57:31.393Z',
    isImported: true
  }

  it('When trying to update all fields, it should pass with no errors', () => {
    try {
      const res = UpdatePaymentSchema.validate(data, validateOptions)
      expect(res.error).toStrictEqual(undefined)
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  it('When trying to update a subset of fields, it should pass with no errors', () => {
    try {
      const {description, value} = data

      const res = UpdatePaymentSchema.validate({
        description,
        value
      }, validateOptions)
      expect(res.error).toStrictEqual(undefined)
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  it('When none of the right fields is given for update, it should fail', () => {
    try {
      const res = UpdatePaymentSchema.validate({
        morty: 'rick'
      }, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "morty" is not allowed,"value" must contain at least one of [contractId, description, value, time, isImported]]')
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

      const res = UpdatePaymentSchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" must be a number,"description" must be a string,"value" must be a number,"time" must be a valid date,"isImported" must be a boolean]')
    }
  })

  it('When the time field is not a proper date, it should fail', () => {
    try {
      const _data = {...data}
      _data.time = 'October 22 of 2019'

      const res = UpdatePaymentSchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "time" must be a valid date]')
    }
  })

  it('When missing all data, it should fail', () => {
    try {
      const res = UpdatePaymentSchema.validate({}, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "value" must contain at least one of [contractId, description, value, time, isImported]]')
    }
  })
})