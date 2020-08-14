import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { handler } from './customersGet'
import { sampleAPIGatewayEvent } from '../helpers/fixtures/apiGatewayEvent'
import { DynamoDB } from 'aws-sdk'

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

interface CustomerModel {
  _id: string
  name: string
  email: string
}

const stubCustomerDatabaseWith = (customer: CustomerModel | null): void => {
  const documentClient = new DynamoDB.DocumentClient()
  ;(documentClient.get({ TableName: '', Key: {} }).promise as jest.Mock).mockReturnValue(
    Promise.resolve({ Item: customer }),
  )
}

const callEndpoint = async (id?: string) => {
  const dummyCustomerId = '123456789'
  return (await handler(
    { ...sampleAPIGatewayEvent, pathParameters: { id: id ? id : dummyCustomerId } },
    {} as Context,
    () => null,
  )) as APIGatewayProxyResult
}

describe('CustomersGet', () => {
  it('should return a 404 if a customer cannot be found in the database', async () => {
    stubCustomerDatabaseWith(null)
    const response = await callEndpoint()
    expect(response.statusCode).toBe(404)
  })

  it('should return a 200 when a customer is found in the database', async () => {
    stubCustomerDatabaseWith({ _id: '123', name: 'Test', email: 'test@test.com' })
    const response = await callEndpoint('123')
    expect(response.statusCode).toBe(200)
  })

  it('should return a 500 if no ID path parameter is provided to the request', async () => {
    const response = (await handler({ ...sampleAPIGatewayEvent }, {} as Context, () => null)) as APIGatewayProxyResult
    expect(response.statusCode).toBe(500)
  })
})
