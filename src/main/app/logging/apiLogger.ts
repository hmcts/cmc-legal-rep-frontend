export class ApiLogger {
  constructor (public logger = require('nodejs-logging').getLogger('apiLogger.js')) {
    this.logger = logger
  }

  logRequest (requestData) {
    return this.logger.debug(this._buildRequestEntry(requestData))
  }

  _buildRequestEntry (requestData) {
    return {
      message: `API: ${requestData.method} ${requestData.uri} ` +
      ((requestData.query) ? `| Query: ${this._stringifyObject(requestData.query)} ` : '') +
      ((requestData.requestBody) ? `| Body: ${this._stringifyObject(requestData.requestBody)} ` : '')
    }
  }

  logResponse (responseData) {
    this._logLevelFor(responseData.responseCode).call(this.logger, this._buildResponseEntry(responseData))
  }

  _buildResponseEntry (responseData) {
    return {
      message: `API: Response ${responseData.responseCode} from ${responseData.uri} ` +
      ((responseData.responseBody) ? `| Body: ${this._stringifyObject(responseData.responseBody)} ` : '') +
      ((responseData.error) ? `| Error: ${this._stringifyObject(responseData.error)} ` : ''),
      responseCode: responseData.responseCode
    }
  }

  _stringifyObject (object) {
    if (object !== null && typeof object === 'object') {
      return JSON.stringify(object)
    }

    if (typeof object === 'string' && object.startsWith('%PDF')) {
      return '**** PDF Content not shown****'
    }

    return object
  }

  _logLevelFor (statusCode) {
    if (statusCode < 400) {
      return this.logger.debug
    } else if (statusCode >= 400 && statusCode < 500) {
      return this.logger.warn
    } else {
      return this.logger.error
    }
  }
}
