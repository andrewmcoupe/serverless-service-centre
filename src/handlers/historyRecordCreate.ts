import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { validate } from 'class-validator'
import * as CustomerService from '../services/customerService'
import { HistoryRecord } from '../domain/CustomerModel'

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
      body: 'No paath parameter provided',
    }
  }

  const payload: HistoryRecord = JSON.parse(event.body)

  const newHistoryRecord = new HistoryRecord(payload)

  const errors = await validate(newHistoryRecord)

  if (errors.length) {
    return {
      statusCode: 400,
      body: JSON.stringify(errors),
    }
  }

  const result = await CustomerService.createHistoryRecord(customerId, newHistoryRecord)

  if (result) {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result),
    }
  } else {
    return {
      statusCode: 500,
      body: JSON.stringify(result),
    }
  }
}
