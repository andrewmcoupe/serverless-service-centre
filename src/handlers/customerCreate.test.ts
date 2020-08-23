import { handler } from './customerCreate'
import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { createAPIGatewayEvent } from '../test-helpers/createAPIGatewayEvent'

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockReturnValue({
      put: jest.fn(() => ({ promise: jest.fn() })),
    }),
  },
}))

describe('Create a customer', () => {
  it('should return a 400 if there is no body provided', async () => {
    const event = createAPIGatewayEvent({ body: null })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBe('No body provided')
  })

  it('should return a 400 if validation fails', async () => {
    const event = createAPIGatewayEvent({ body: JSON.stringify({ name: 'Andy' }) })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
  })

  it('should return 200 on successfully creating a customer', async () => {
    const event = createAPIGatewayEvent({
      body: JSON.stringify({
        name: 'Test name',
        email: 'test@test.com',
        address: '12 Smith sT',
      }),
    })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
  })

  it('should return 400 if new customer email is not valid', async () => {
    const event = createAPIGatewayEvent({
      body: JSON.stringify({
        name: 'Test name',
        email: 'testtest.com',
        address: '12 Smith sT',
      }),
    })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
  })
})
