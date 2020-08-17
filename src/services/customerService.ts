import { v4 as uuid } from 'uuid'
import * as DataAccess from '../data/dataAccess'
import { CustomerBaseRecord, CustomerModel } from '../domain/CustomerModel'

export const getCustomerById = async (id: string) => {
  const customer = await DataAccess.getCustomerById(id)
  return customer
}

export const getCustomers = async () => {
  const customers = await DataAccess.getCustomers()
  return customers
}

export const createCustomer = async (customer: CustomerBaseRecord) => {
  const augmentedCustomer: CustomerModel = {
    ...customer,
    _id: uuid(),
    history: [],
  }
  const newCustomer = await DataAccess.createCustomer(augmentedCustomer)
  return newCustomer
}

export const deleteCustomerById = async (id: string) => {
  return await DataAccess.deleteCustomerById(id)
}
