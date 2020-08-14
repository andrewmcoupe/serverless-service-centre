import { DynamoDB } from 'aws-sdk'
import { CustomerModel } from '../domain/CustomerModel'

const dynamoDb = new DynamoDB.DocumentClient()

export const getCustomerById = async (id: string) => {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: process.env.CUSTOMERS_TABLE_NAME as string,
    Key: {
      _id: id,
    },
  }
  const result = await dynamoDb.get(params).promise()

  return result.Item
}

export const createCustomer = async (customer: CustomerModel) => {
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
