import { v4 as uuid } from 'uuid'
import { company, internet, address, name, phone } from 'faker'
import { CustomerModel } from '../domain/CustomerModel'

export const createFakeCustomer = (): CustomerModel => {
  return {
    _id: uuid(),
    name: company.companyName(),
    email: internet.email(),
    phone1: {
      name: name.firstName(),
      number: phone.phoneNumber(),
    },
    phone2: {
      name: name.firstName(),
      number: phone.phoneNumber(),
    },
    phone3: {
      name: name.firstName(),
      number: phone.phoneNumber(),
    },
    address: address.streetAddress(),
    history: [
      {
        _id: uuid(),
        compressor: '',
        jobDescription: '',
        supplier: '',
        quoteMedia: '',
        powraMedia: '',
        ramMedia: '',
        jobSheetMedia: '',
        invoiceMedia: '',
        invoiceNumber: '',
        nextDueDate: null,
        purchaseOrderNumber: '',
      },
    ],
  }
}
