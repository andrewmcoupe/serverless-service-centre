import { handler } from './customerUpdate'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { createAPIGatewayEvent } from '../test-helpers/createAPIGatewayEvent'
import { CustomerModel } from '../domain/CustomerModel'
import { DynamoDB } from 'aws-sdk'
import { createFakeCustomer } from '../test-helpers/createFakeCustomer'

jest.mock('aws-sdk', () => {
  const mockedDocClient = {
    put: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
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

const callEndpoint = async (eventData: Partial<APIGatewayProxyEvent>) => {
  const event = createAPIGatewayEvent(eventData)
  return (await handler(event, {} as Context, () => null)) as APIGatewayProxyResult
}

describe('Update a customer', () => {
  it('should return a 200 if the customer has been updated', async () => {
    const stubCustomer = createFakeCustomer()
    stubCustomerDatabaseWith(stubCustomer)
    const stubId = '123456789'
    const stubBody = JSON.stringify({ name: 'Lickety Split', email: 'asd@asd.com', address: 'Unknown' })
    const stubEventData: Partial<APIGatewayProxyEvent> = {
      pathParameters: { id: stubId },
      body: stubBody,
    }
    const response = await callEndpoint(stubEventData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual('true')
  })

  it('should return a 400 if no path parameter is provided', async () => {
    const stubCustomer = createFakeCustomer()
    stubCustomerDatabaseWith(stubCustomer)
    const stubBody = JSON.stringify({ name: 'Lickety Split', email: 'asd@asd.com', address: 'Unknown' })
    const stubEventData: Partial<APIGatewayProxyEvent> = {
      pathParameters: {},
      body: stubBody,
    }
    const response = await callEndpoint(stubEventData)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual('Path parameter customer ID must be provided')
  })
})
