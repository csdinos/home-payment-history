import {Payment} from './'

export interface PaymentHistory {
  items: Array<Payment>
  sum: number
}