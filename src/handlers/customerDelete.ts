import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as CustomerService from '../services/customerService'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 500,
      body: 'Path parameter ID must be provided',
    }
  }

  const result = await CustomerService.deleteCustomerById(event.pathParameters.id)

  if (!result) {
    return {
      statusCode: 404,
      body: `Problem deleting customer with ID <${event.pathParameters.id}`,
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  }
}
