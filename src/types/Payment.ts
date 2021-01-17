export interface Payment {
  contractId: number
  description: string
  value: number
  time: string
  isImported: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}