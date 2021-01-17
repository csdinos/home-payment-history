import {PaymentHistorySchema} from '@appRoot/validation'
import {validateOptions} from '@appRoot/validation/__tests__/test-utils'

describe('history payment validation scenarios', () => {
  const data = {
    contractId: 123123,
    startDate: '2016-12-09T12:57:31.393Z',
    endDate: '2016-12-09T12:57:31.393Z'
  }

  it('When given valid data, it should pass with no errors', () => {
    try {
      const res = PaymentHistorySchema.validate(data, validateOptions)
      expect(res.error).toStrictEqual(undefined)
    } catch (e) {
      expect(e).toBeUndefined()
    }
  })

  it('When missing required data, it should fail', () => {
    try {
      const _data = {...data}
      delete _data.startDate

      const res = PaymentHistorySchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "startDate" is required]')
    }
  })

  it('When data types are invalid, it should fail', () => {
    try {
      const _data = {
        contractId: 'ninety two',
        startDate: '1111112016-12-09T12:57:31.393Z',
        endDate: 'first of march I think'
      }

      const res = PaymentHistorySchema.validate(_data, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" must be a number,"startDate" must be a valid date,"endDate" must be a valid date]')
    }
  })

  it('When missing all data, it should fail', () => {
    try {
      const res = PaymentHistorySchema.validate({}, validateOptions)
      expect(res.error).toBeDefined()
    } catch (e) {
      expect(e).toMatchInlineSnapshot('[HttpError: Validation error: "contractId" is required,"startDate" is required,"endDate" is required]')
    }
  })
})