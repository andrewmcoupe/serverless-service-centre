import { execSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'
import axios, { AxiosResponse } from 'axios'
import { company, internet, address } from 'faker'

import { CustomerModel } from '../domain/CustomerModel'

const STAGE = 'integration'

describe('Get customer from DynamoDB', () => {
  let apiBaseUrl: string | null = null
  let stubCustomer: CustomerModel | null = null

  beforeAll(async () => {
    // deploy stack
    execSync(
      `npx serverless deploy --config serverless/test-stacks/serverless.getcustomer.integration.yml --stage ${STAGE}`,
      { stdio: 'inherit' },
    )

    // Read from the outputs file serverless stack output plugin provides
    const outputs = JSON.parse(readFileSync('serverless-output.json', { encoding: 'utf8' }))
    apiBaseUrl = outputs.ServiceEndpoint

    // Add a customer to the DB so we can retrieve in our tests
    const response: AxiosResponse<CustomerModel> = await axios.post(`${apiBaseUrl}/customers`, {
      name: company.companyName(),
      email: internet.email(),
      address: address.streetAddress(),
    })

    stubCustomer = response.data
  })

  afterAll(() => {
    execSync(
      `npx serverless remove --config serverless/test-stacks/serverless.getcustomer.integration.yml --stage ${STAGE}`,
      { stdio: 'inherit' },
    )

    // Remove serverless output file
    unlinkSync('serverless-output.json')
  })

  it('should retrieve the customer from the database', async () => {
    const result: AxiosResponse<CustomerModel> = await axios.get(`${apiBaseUrl}/customers/${stubCustomer?._id}`)

    expect(result.data.name).toEqual(stubCustomer?.name)
  })
})