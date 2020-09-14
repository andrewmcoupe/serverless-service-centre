import { handler } from './historyRecordCreate'
import { APIGatewayProxyResult, Context } from 'aws-lambda'
import { createAPIGatewayEvent } from '../test-helpers/createAPIGatewayEvent'
import { getCustomerById, updateCustomer } from '../data/dataAccess'
import { createFakeCustomer } from '../test-helpers/createFakeCustomer'

jest.mock('../data/dataAccess')

describe('Create a customer history record', () => {
  it('should return a 400 if there is no body provided', async () => {
    const event = createAPIGatewayEvent({ body: null })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
    expect(result.body).toBe('No body provided')
  })

  it('should return a 400 if validation fails', async () => {
    const event = createAPIGatewayEvent({ body: JSON.stringify({ compressor: 'Hertz 123' }) })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
  })

  it('should return a 400 if no path parameter is given', async () => {
    const event = createAPIGatewayEvent({ pathParameters: {}, body: JSON.stringify({ compressor: 'Hertz 123' }) })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(400)
  })

  it('should return 200 on successfully creating a customer history record', async () => {
    const mockGetCustomerById = getCustomerById as jest.Mock
    mockGetCustomerById.mockResolvedValue(createFakeCustomer())
    const mockUpdateCustomer = updateCustomer as jest.Mock
    mockUpdateCustomer.mockResolvedValue(true)

    const event = createAPIGatewayEvent({
      pathParameters: { id: 'FAKE_ID' },
      body: JSON.stringify({
        compressor: 'Hertz 123',
        jobDescription: 'Service',
        supplier: 'Hertz',
        quoteSheetUrl: '',
        powraSheetUrl: '',
        ramsSheetUrl: '',
        jobSheetUrl: '',
        invoiceUrl: '',
        invoiceNumber: '123332213',
        nextDueDate: null,
        purchaseOrderNumber: '1234567',
      }),
    })
    const result = (await handler(event, {} as Context, jest.fn())) as APIGatewayProxyResult

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe('true')
  })
})
