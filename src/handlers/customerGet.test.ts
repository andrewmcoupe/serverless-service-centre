import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { createAPIGatewayEvent } from '../test-helpers/createAPIGatewayEvent'
import { handler } from './customerGet'
import { CustomerModel } from '../domain/CustomerModel'
import { createFakeCustomer } from '../test-helpers/createFakeCustomer'

jest.mock('aws-sdk', () => {
  const mockedDocClient = {
    scan: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    transactWrite: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  }
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mockedDocClient) },
  }
})

const stubCustomerDatabaseWith = (customer: CustomerModel | null): void => {
  const documentClient = new DynamoDB.DocumentClient()
  const get = documentClient.get({ TableName: '', Key: {} }).promise as jest.Mock
  get.mockResolvedValue({ Item: customer })
}

const callEndpoint = async (id?: string) => {
  const dummyCustomerId = '123456789'
  const event = createAPIGatewayEvent({ pathParameters: { id: id ? id : dummyCustomerId } })
  return (await handler(event, {} as Context, () => null)) as APIGatewayProxyResult
}

describe('CustomerGet', () => {
  it('should return a 404 if a customer cannot be found in the database', async () => {
    stubCustomerDatabaseWith(null)
    const response = await callEndpoint()
    expect(response.statusCode).toBe(404)
  })

  it('should return a 200 when a customer is found in the database', async () => {
    const stubCustomer = createFakeCustomer()
    stubCustomerDatabaseWith(stubCustomer)
    const response = await callEndpoint('123')
    expect(response.statusCode).toBe(200)
  })

  it('should return a 500 if no ID path parameter is provided to the request', async () => {
    const eventWithNoIdParam = createAPIGatewayEvent()
    const response = (await handler(eventWithNoIdParam, {} as Context, () => null)) as APIGatewayProxyResult
    expect(response.statusCode).toBe(500)
  })
})
