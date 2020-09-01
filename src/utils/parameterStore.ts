import { SSM } from 'aws-sdk'

export const getParam = async (name: string): Promise<string | undefined> => {
  const ssm = new SSM()
  const result = await ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .promise()

  return result.Parameter?.Value
}
