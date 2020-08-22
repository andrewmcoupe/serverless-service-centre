import { IsEmail, IsString } from 'class-validator'
import { v4 as uuid } from 'uuid'

export interface CustomerModel {
  _id: string
  name: string
  email: string
  address: string
  history: HistoryItem[]
}

export class CustomerBaseRecord {
  _id: string

  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  address: string

  constructor(customer: CustomerBaseRecord) {
    this._id = uuid()
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