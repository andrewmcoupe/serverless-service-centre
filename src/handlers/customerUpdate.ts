import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as CustomerService from '../services/customerService'
import { CustomerModel } from '../domain/CustomerModel'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'No body provided',
    }
  }

  const customerId = event.pathParameters?.id

  if (!customerId) {
    return {
      statusCode: 400,
      body: 'Path parameter customer ID must be provided',
    }
  }

  const payload: CustomerModel = JSON.parse(event.body)

  const result = await CustomerService.updateCustomer(customerId, payload)

  if (result) {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    }
  } else {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: 'Internal Server Error',
    }
  }
}
