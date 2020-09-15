import { execSync } from 'child_process'
import { readFileSync, unlinkSync } from 'fs'
import waitForExpect from 'wait-for-expect'
import axios, { AxiosResponse } from 'axios'
import { company, internet, address, name, phone } from 'faker'

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
    execSync(
      `npx serverless remove --config serverless/test-stacks/serverless.createcustomer.integration.yml --stage ${STAGE}`,
      { stdio: 'inherit' },
    )

    // Remove serverless output file
    unlinkSync('serverless-output.json')
  })

  it('should successfully create a new customer and store in the database', async () => {
    const stubNewCustomer = {
      name: company.companyName(),
      email: internet.email(),
      phone1: {
        name: name.firstName(),
        number: phone.phoneNumber(),
      },
      phone2: {
        name: name.firstName(),
        number: phone.phoneNumber(),
      },
      phone3: {
        name: name.firstName(),
        number: phone.phoneNumber(),
      },
      address: address.streetAddress(),
    }

    const response: AxiosResponse<CustomerModel> = await axios.post(`${apiBaseUrl}/customers`, stubNewCustomer)
    await waitForExpect(
      () => {
        expect(response.status).toBe(200)
        expect(response.data.name).toEqual(stubNewCustomer.name)
        expect(response.data.phone1.name).toEqual(stubNewCustomer.phone1.name)
        expect(response.data.phone1.number).toEqual(stubNewCustomer.phone1.number)
        expect(response.data.phone2.name).toEqual(stubNewCustomer.phone2.name)
        expect(response.data.phone2.number).toEqual(stubNewCustomer.phone2.number)
        expect(response.data.phone3.name).toEqual(stubNewCustomer.phone3.name)
        expect(response.data.phone3.number).toEqual(stubNewCustomer.phone3.number)
        expect(response.data.email).toEqual(stubNewCustomer.email)
        expect(response.data.address).toEqual(stubNewCustomer.address)
      },
      10000,
      10000,
    )
  }, 10000)
})
