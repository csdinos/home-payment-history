import {Payment} from '@appRoot/types/Payment'

export type HistoryRequestData = {
  contractId: number,
  startDate: string,
  endDate: string
}

export type PaymentRequestData = Pick<Payment, 'contractId' |'description'| 'value'| 'time'| 'isImported'>
