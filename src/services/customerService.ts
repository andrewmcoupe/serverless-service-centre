import { v4 as uuid } from 'uuid'
import * as DataAccess from '../data/dataAccess'
import { CustomerModel } from '../domain/CustomerModel'

export const getCustomerById = async (id: string) => {
  const customer = await DataAccess.getCustomerById(id)
  return customer
}

export const getCustomers = async () => {
  const customers = await DataAccess.getCustomers()
  return customers
}

export const createCustomer = async (customer: CustomerModel) => {
  const newCustomer = await DataAccess.createCustomer({ ...customer, _id: uuid() })
  return newCustomer
}
