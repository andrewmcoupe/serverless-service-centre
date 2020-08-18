import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { DynamoDB } from 'aws-sdk'
import { handler } from './customersGet'
import { sampleAPIGatewayEvent } from '../test-helpers/fixtures/apiGatewayEvent'
import { CustomerModel } from '../domain/CustomerModel'
import { createFakeCustomer } from '../test-helpers/createFakeCustomer'

jest.mock('aws-sdk', () => {
  const mockedDocClient = {
    scan: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  }
  return {
    DynamoDB: { DocumentClient: jest.fn(() => mockedDocClient) },
  }
})

const stubCustomerDatabaseWith = (customers: CustomerModel[]): void => {
  const documentClient = new DynamoDB.DocumentClient()
  const scan = documentClient.scan({ TableName: '' }).promise as jest.Mock
  scan.mockResolvedValue({ Items: [...customers] })
}

const callEndpoint = async () => {
  return (await handler(sampleAPIGatewayEvent, {} as Context, () => null)) as APIGatewayProxyResult
}

describe('CustomersGet', () => {
  it('should return a 200 with a list of customers', async () => {
    const customers = [createFakeCustomer(), createFakeCustomer()]

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
