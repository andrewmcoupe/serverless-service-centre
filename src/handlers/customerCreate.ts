import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import withMiddleware from '../middleware/withMiddleware'

const dynamoDb = new DynamoDB.DocumentClient()
const CUSTOMERS_TABLE_NAME = process.env.CUSTOMERS_TABLE_NAME as string

export const createCustomer: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'No body provided',
    }
  }

  const payload = JSON.parse(event.body)

  if (!payload.name || !payload.email) {
    return {
      statusCode: 400,
      body: 'Name and email must be provided',
    }
  }

  const params = {
    TableName: CUSTOMERS_TABLE_NAME,
    Item: payload,
  }

  await dynamoDb.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  }
}

export const handler = withMiddleware(createCustomer)
