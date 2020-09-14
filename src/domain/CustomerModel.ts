import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
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

const additionalPhoneContact: PhoneContact = {
  name: '',
  number: '',
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
    this.phone2 = customer.phone2 ?? { ...additionalPhoneContact }
    this.phone3 = customer.phone3 ?? { ...additionalPhoneContact }
    this.email = customer.email
    this.address = customer.address
  }
}

export class HistoryRecord {
  _id: string

  @IsNotEmpty()
  compressor: string

  @IsNotEmpty()
  jobDescription: string

  @IsNotEmpty()
  supplier: string

  @IsString()
  quoteSheetUrl: string

  @IsString()
  powraSheetUrl: string

  @IsString()
  ramsSheetUrl: string

  @IsString()
  jobSheetUrl: string

  @IsString()
  invoiceUrl: string

  invoiceNumber: string
  nextDueDate: Date | null
  purchaseOrderNumber: string

  constructor(historyRecord: HistoryRecord) {
    this._id = uuid()
    this.compressor = historyRecord.compressor
    this.jobDescription = historyRecord.jobDescription
    this.supplier = historyRecord.supplier
    this.quoteSheetUrl = historyRecord.quoteSheetUrl
    this.powraSheetUrl = historyRecord.powraSheetUrl
    this.ramsSheetUrl = historyRecord.ramsSheetUrl
    this.jobSheetUrl = historyRecord.jobSheetUrl
    this.invoiceUrl = historyRecord.invoiceUrl
    this.invoiceNumber = historyRecord.invoiceNumber
    this.nextDueDate = historyRecord.nextDueDate
    this.purchaseOrderNumber = historyRecord.purchaseOrderNumber
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
