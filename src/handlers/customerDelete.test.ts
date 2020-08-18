import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { createAPIGatewayEvent } from '../test-helpers/createAPIGatewayEvent'
import { CustomerModel } from '../domain/CustomerModel'
import { handler } from './customerDelete'
import { createFakeCustomer } from '../test-helpers/createFakeCustomer'

jest.mock('aws-sdk', () => {
  const mockedDocClient = {
    put: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
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

const callEndpoint = async (id?: string) => {
  const dummyCustomerId = '123456789'
  const emptyPathParams = {
    pathParameters: {},
  }
  const event = createAPIGatewayEvent(id ? { pathParameters: { id: id ? id : dummyCustomerId } } : emptyPathParams)
  return (await handler(event, {} as Context, () => null)) as APIGatewayProxyResult
}

describe('CustomerDelete', () => {
  it('should return a 200 if the customer is successfully deleted', async () => {
    const stubCustomer = createFakeCustomer()
    stubCustomerDatabaseWith(stubCustomer)
    const response = await callEndpoint(stubCustomer._id)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual('true')
  })

  it('should return a 404 if there is no customer with the specified ID', async () => {
    stubCustomerDatabaseWith(null)
    const response = await callEndpoint('1234')
    expect(response.statusCode).toBe(404)
  })
})
