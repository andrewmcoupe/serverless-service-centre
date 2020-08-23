import { DynamoDB } from 'aws-sdk'
import { CustomerModel } from '../domain/CustomerModel'

const dynamoDb = new DynamoDB.DocumentClient()

export const getCustomerById = async (id: string): Promise<DynamoDB.DocumentClient.AttributeMap | undefined> => {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Key: {
      _id: id,
    },
  }

  const result = await dynamoDb.get(params).promise()

  return result.Item
}

export const getCustomers = async (): Promise<DynamoDB.DocumentClient.QueryOutput> => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
  }

  return await dynamoDb.scan(params).promise()
}

export const createCustomer = async (customer: CustomerModel): Promise<CustomerModel | false> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Item: customer,
  }

  try {
    await dynamoDb.put(params).promise()

    return customer
  } catch (error) {
    return false
  }
}

export const updateCustomer = async (id: string, customer: CustomerModel): Promise<boolean> => {
  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Key: {
      _id: id,
    },
    UpdateExpression: 'SET #cn = :nameValue, email = :email, address = :address, history = :history',
    ExpressionAttributeValues: {
      ':nameValue': customer.name,
      ':email': customer.email,
      ':address': customer.address,
      ':history': customer.history,
    },
    ExpressionAttributeNames: {
      '#cn': 'name',
    },
  }

  try {
    await dynamoDb.update(params).promise()

    return true
  } catch (error) {
    return false
  }
}

export const deleteCustomerById = async (id: string): Promise<boolean> => {
  const existingCustomer = await getCustomerById(id)

  if (!existingCustomer) {
    return false
  }

  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Key: {
      _id: id,
    },
    ReturnValues: 'ALL_OLD',
  }

  try {
    await dynamoDb.delete(params).promise()

    return true
  } catch (error) {
    throw new Error('Error deleting customer')
  }
}
