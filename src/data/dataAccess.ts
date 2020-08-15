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

export const createCustomer = async (customer: CustomerModel): Promise<boolean> => {
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Item: customer,
  }

  try {
    await dynamoDb.put(params).promise()

    return true
  } catch (error) {
    return false
  }
}
