import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as CustomerService from '../services/customerService'

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  const customers = await CustomerService.getCustomers()

  return {
    statusCode: 200,
    body: JSON.stringify(customers),
  }
}
