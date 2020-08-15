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

  it('should return a 400 if email field is missing', async () => {
    const event = createAPIGatewayEvent({ body: JSON.stringify({ name: 'Andy' }) })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBe('Name and email must be provided')
  })

  it('should return 200 on successfully creating a customer', async () => {
    const event = createAPIGatewayEvent({ body: JSON.stringify({ name: 'Test name', email: 'test@test.com' }) })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe('true')
  })
})
