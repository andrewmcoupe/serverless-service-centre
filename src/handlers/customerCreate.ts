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

  const newCustomer = new CustomerBaseRecord(payload)

  const errors = await validate(newCustomer)

  if (errors.length) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(errors),
    }
  }

  const result = await CustomerService.createCustomer(newCustomer)

  if (result) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result),
    }
  } else {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    }
  }
}
