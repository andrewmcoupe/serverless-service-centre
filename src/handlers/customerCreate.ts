import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'

const dynamoDb = new DynamoDB.DocumentClient()

export class BodyError extends Error {}

// TODO: Add lambda middleware
export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
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
    TableName: 'customersTable',
    Item: payload,
  }

  await dynamoDb.put(params)

  return {
    statusCode: 200,
    body: JSON.stringify(payload),
  }
}
