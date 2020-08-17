import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { validate } from 'class-validator'
import * as CustomerService from '../services/customerService'
import { CustomerBaseRecord } from '../domain/CustomerModel'

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'No body provided',
    }
  }

  const payload: CustomerBaseRecord = JSON.parse(event.body)

  if (!payload.name || !payload.email || !payload.address) {
    return {
      statusCode: 400,
      body: 'Name, email and address must be provided when creating a new customer',
    }
  }

  const newCustomer = new CustomerBaseRecord(payload)

  const errors = await validate(newCustomer)

  if (errors.length) {
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    }
  }

  const result = await CustomerService.createCustomer(newCustomer)

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
