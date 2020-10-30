import * as DataAccess from '../data/dataAccess'
import { CustomerBaseRecord, CustomerModel, HistoryRecord } from '../domain/CustomerModel'
import { DynamoDB } from 'aws-sdk'

export const getCustomerById = async (id: string): Promise<DynamoDB.DocumentClient.AttributeMap | undefined> => {
  return await DataAccess.getCustomerById(id)
}

export const getCustomers = async (): Promise<DynamoDB.DocumentClient.ScanOutput> => {
  return await DataAccess.getCustomers()
}

export const createCustomer = async (customer: CustomerBaseRecord): Promise<CustomerModel | false> => {
  const augmentedCustomer: CustomerModel = {
    ...customer,
    history: [],
  }
  return await DataAccess.createCustomer(augmentedCustomer)
}

export const updateCustomer = async (id: string, customer: CustomerModel): Promise<boolean> => {
  return await DataAccess.updateCustomer(id, customer)
}

export const deleteCustomerById = async (id: string): Promise<boolean> => {
  return await DataAccess.deleteCustomerById(id)
}
export const createHistoryRecord = async (id: string, historyRecord: HistoryRecord): Promise<boolean> => {
  const customer = (await getCustomerById(id)) as CustomerModel

  if (!customer) {
    return false
  }

  const augmentedCustomer = {
    ...customer,
    history: [...customer.history, historyRecord],
  }

  return await updateCustomer(customer._id, augmentedCustomer)
}
