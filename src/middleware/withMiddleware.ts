import middy from '@middy/core'
import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import httpEventNormalizer from '@middy/http-event-normalizer'

export default (handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>) =>
  middy(handler).use([httpEventNormalizer(), jsonBodyParser(), httpErrorHandler()])
