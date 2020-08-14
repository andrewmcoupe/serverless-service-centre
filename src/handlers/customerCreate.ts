import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as CustomerService from '../services/customerService'

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

  const result = await CustomerService.createCustomer(payload)
  if (result) {
    return {
      statusCode: 200,
      body: JSON.stringify(true),
    }
  } else {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}
