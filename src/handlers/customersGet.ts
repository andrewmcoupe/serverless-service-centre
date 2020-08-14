import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
// import { DynamoDB } from 'aws-sdk'
import * as CustomerService from '../services/customerService'

// const dynamoDb = new DynamoDB.DocumentClient()
// const CUSTOMERS_TABLE_NAME = process.env.CUSTOMERS_TABLE_NAME || 'test'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 500,
      body: 'Path parameter ID must be provided',
    }
  }

  const customer = await CustomerService.getCustomerById(event.pathParameters.id)

  if (!customer) {
    return {
      statusCode: 404,
      body: 'Vehicle not found',
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(customer),
  }
}
