import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import { handler } from './customersGet'
import { sampleAPIGatewayEvent } from '../test-helpers/fixtures/apiGatewayEvent'
import { CustomerModel } from '../domain/CustomerModel'

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

const stubCustomerDatabaseWith = (customers: CustomerModel[]): void => {
  const documentClient = new DynamoDB.DocumentClient()
  ;(documentClient.scan({ TableName: '' }).promise as jest.Mock).mockReturnValue(
    Promise.resolve({ Items: [...customers] }),
  )
}

const callEndpoint = async () => {
  return (await handler(sampleAPIGatewayEvent, {} as Context, () => null)) as APIGatewayProxyResult
}

describe('CustomersGet', () => {
  it('should return a 200 with a list of customers', async () => {
    const customers = [
      { _id: uuid(), name: 'Test1', email: 'test1@test.com' },
      {
        _id: uuid(),
        name: 'Test2',
        email: 'test2@test.com',
      },
      { _id: uuid(), name: 'Test3', email: 'test3@test.com' },
    ]

    stubCustomerDatabaseWith(customers)

    const response = await callEndpoint()
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.Items).toEqual(customers)
  })

  it('should return a 200 with an empty object if no customers exist', async () => {
    stubCustomerDatabaseWith([])
    const response = await callEndpoint()
    const body = JSON.parse(response.body)

    expect(response.statusCode).toBe(200)
    expect(body.Items).toEqual([])
  })
})
