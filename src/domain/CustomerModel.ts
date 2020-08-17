import { IsEmail } from 'class-validator'

export interface CustomerModel {
  _id: string
  name: string
  email: string
  address: string
  history: HistoryItem[]
}

export class CustomerBaseRecord {
  name: string

  @IsEmail()
  email: string
  address: string

  constructor(customer: CustomerBaseRecord) {
    this.name = customer.name
    this.email = customer.email
    this.address = customer.address
  }
}

export interface HistoryItem {
  _id: string
  compressor: string
  jobDescription: string
  supplier: string
  quoteSheetUrl: string
  powraSheetUrl: string
  ramsSheetUrl: string
  jobSheetUrl: string
  invoiceUrl: string
  invoiceNumber: string
  nextDueDate: Date | null
  purchaseOrderNumber: string
}
