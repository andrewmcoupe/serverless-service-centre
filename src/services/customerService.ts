import * as DataAccess from '../data/dataAccess'
import { CustomerBaseRecord, CustomerModel } from '../domain/CustomerModel'
import { DynamoDB } from 'aws-sdk'

export const getCustomerById = async (id: string): Promise<DynamoDB.DocumentClient.AttributeMap | undefined> => {
  return await DataAccess.getCustomerById(id)
}

export const getCustomers = async (): Promise<DynamoDB.DocumentClient.ScanOutput> => {
  return await DataAccess.getCustomers()
}

export const createCustomer = async (customer: CustomerBaseRecord): Promise<boolean> => {
  const augmentedCustomer: CustomerModel = {
    ...customer,
    history: [],
  }
  return await DataAccess.createCustomer(augmentedCustomer)
}

export const deleteCustomerById = async (id: string): Promise<boolean> => {
  return await DataAccess.deleteCustomerById(id)
}
