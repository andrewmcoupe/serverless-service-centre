import { v4 as uuid } from 'uuid'
import { company, internet, address } from 'faker'
import { CustomerModel } from '../domain/CustomerModel'

export const createFakeCustomer = (): CustomerModel => {
  return {
    _id: uuid(),
    name: company.companyName(),
    email: internet.email(),
    address: address.streetAddress(),
    history: [
      {
        _id: uuid(),
        compressor: '',
        jobDescription: '',
        supplier: '',
        quoteSheetUrl: '',
        powraSheetUrl: '',
        ramsSheetUrl: '',
        jobSheetUrl: '',
        invoiceUrl: '',
        invoiceNumber: '',
        nextDueDate: null,
        purchaseOrderNumber: '',
      },
    ],
  }
}
