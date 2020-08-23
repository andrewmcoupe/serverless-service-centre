import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as CustomerService from '../services/customerService'

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
      body: 'Customer not found',
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(customer),
  }
}
