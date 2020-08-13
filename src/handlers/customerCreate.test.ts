import { handler } from './customerCreate'
import { sampleAPIGatewayEvent } from '../helpers/fixtures/apiGatewayEvent'
import { APIGatewayProxyResult, Context } from 'aws-lambda'

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockReturnValue({
      put: jest.fn(() => ({ promise: jest.fn() })),
    }),
  },
}))

describe('Create a customer', () => {
  it('should return a 400 if there is no body provided', async () => {
    const result = (await handler(
      {
        ...sampleAPIGatewayEvent,
        body: null,
      },
      {} as Context,
      jest.fn(),
    )) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBe('No body provided')
  })

  it('should return 200 on successfully creating a customer', async () => {
    const body = JSON.stringify({ name: 'Test name', email: 'test@test.com' })
    const result = (await handler(
      {
        ...sampleAPIGatewayEvent,
        body,
      },
      {} as Context,
      jest.fn(),
    )) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toMatch(body)
  })
})
