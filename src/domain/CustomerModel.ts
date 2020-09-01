import { IsEmail, IsNotEmpty } from 'class-validator'
import { v4 as uuid } from 'uuid'

interface PhoneContact {
  name: string
  number: string
}

export interface CustomerModel {
  _id: string
  name: string
  email: string
  phone1: PhoneContact
  phone2: PhoneContact
  phone3: PhoneContact
  address: string
  history: HistoryItem[]
}

export class CustomerBaseRecord {
  _id: string

  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  phone1: PhoneContact

  phone2: PhoneContact

  phone3: PhoneContact

  @IsNotEmpty()
  address: string

  constructor(customer: CustomerBaseRecord) {
    this._id = uuid()
    this.name = customer.name
    this.phone1 = customer.phone1
    this.phone2 = customer.phone2
    this.phone3 = customer.phone3
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
