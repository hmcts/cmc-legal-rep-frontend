import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { ApiLogger } from 'logging/apiLogger'
import * as requestPromise from 'request-promise-native'
import * as request from 'request'

const logger = new ApiLogger()

const localDevEnvironment = 'development'
const developmentMode = (process.env.NODE_ENV || localDevEnvironment) === localDevEnvironment

const timeout: number = developmentMode ? 10000 : 1500

const wrappedRequestPromise = requestPromise
  .defaults({
    json: true,
    timeout: timeout
  })

export default new Proxy(wrappedRequestPromise, new RequestLoggingHandler(wrappedRequestPromise, logger))

const requestNonPromise = new Proxy(request, new RequestLoggingHandler(request, logger))

export { requestNonPromise }
