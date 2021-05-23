import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { v4 as uuid } from 'uuid'

export interface CustomerModel {
  _id: string
  name: string
  email: string
  phone1: typeof additionalPhoneContact
  phone2: typeof additionalPhoneContact
  phone3: typeof additionalPhoneContact
  address: string
  history: HistoryItem[]
}

const additionalPhoneContact = {
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
  phone1: typeof additionalPhoneContact

  phone2: typeof additionalPhoneContact

  phone3: typeof additionalPhoneContact

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
  quoteMedia: string

  @IsString()
  powraMedia: string

  @IsString()
  ramMedia: string

  @IsString()
  jobSheetMedia: string

  @IsString()
  invoiceMedia: string

  invoiceNumber: string
  nextDueDate: Date | null
  purchaseOrderNumber: string
  notRequiredInputs: string[]

  constructor(historyRecord: HistoryRecord) {
    this._id = uuid()
    this.compressor = historyRecord.compressor
    this.jobDescription = historyRecord.jobDescription
    this.supplier = historyRecord.supplier
    this.quoteMedia = historyRecord.quoteMedia ?? ''
    this.powraMedia = historyRecord.powraMedia ?? ''
    this.ramMedia = historyRecord.ramMedia ?? ''
    this.jobSheetMedia = historyRecord.jobSheetMedia ?? ''
    this.invoiceMedia = historyRecord.invoiceMedia ?? ''
    this.invoiceNumber = historyRecord.invoiceNumber
    this.nextDueDate = historyRecord.nextDueDate
    this.purchaseOrderNumber = historyRecord.purchaseOrderNumber
    this.notRequiredInputs = historyRecord.notRequiredInputs ?? []
  }
}

export interface HistoryItem {
  _id: string
  compressor: string
  jobDescription: string
  supplier: string
  quoteMedia: string
  powraMedia: string
  ramMedia: string
  jobSheetMedia: string
  invoiceMedia: string
  invoiceNumber: string
  nextDueDate: Date | null
  purchaseOrderNumber: string
}
