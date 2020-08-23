import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import axios, { AxiosResponse } from 'axios'
import { company, internet, address } from 'faker'

import { CustomerModel } from '../domain/CustomerModel'

const STAGE = 'integration'

describe('Create customer and add to DynamoDB', () => {
  let apiBaseUrl: string | null = null

  beforeAll(async () => {
    // deploy stack
    execSync(
      `npx serverless deploy --config serverless/test-stacks/serverless.createcustomer.integration.yml --stage ${STAGE}`,
      { stdio: 'inherit' },
    )

    // Read from the outputs file serverless stack output plugin provides
    const outputs = JSON.parse(readFileSync('serverless-output.json', { encoding: 'utf8' }))
    apiBaseUrl = outputs.ServiceEndpoint
  })

  afterAll(() => {
    // execSync(
    //   `npx serverless remove --config serverless/test-stacks/serverless.createcustomer.integration.yml --stage ${STAGE}`,
    //   { stdio: 'inherit' },
    // )
    //
    // // Remove serverless output file
    // unlinkSync('serverless-output.json')
  })

  it('should successfully create a new customer and store in the database', async () => {
    const stubNewCustomer = {
      name: company.companyName(),
      email: internet.email(),
      address: address.streetAddress(),
    }

    const response: AxiosResponse<CustomerModel> = await axios.post(`${apiBaseUrl}/customers`, stubNewCustomer)

    expect(response.status).toBe(200)
    expect(response.data.name).toEqual(stubNewCustomer.name)
    expect(response.data.email).toEqual(stubNewCustomer.email)
    expect(response.data.address).toEqual(stubNewCustomer.address)
  })
})
