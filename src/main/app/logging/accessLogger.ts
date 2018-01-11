import { Logger } from '@hmcts/nodejs-logging'

export class AccessLogger {
  constructor (public logger = Logger.getLogger('accessLogger.js')) {
    this.logger = logger
  }

  log (req, res) {
    switch (res.statusCode) {
      case 400:
      case 401:
      case 403:
        this.logger.error(this._buildAccessLogEntry(req, res))
        break

      case 404:
        this.logger.warn(this._buildAccessLogEntry(req, res))
        break

      case 422:
        this.logger.debug(this._buildAccessLogEntry(req, res))
        break

      default:
        if (res.statusCode >= 500) {
          this.logger.error(this._buildAccessLogEntry(req, res))
        } else {
          this.logger.trace(this._buildAccessLogEntry(req, res))
        }
    }
  }

  _buildAccessLogEntry (req, res) {
    return {
      message: `Access: ${req.method} to ${req.url} returned ${res.statusCode} ` +
      ((req.body) ? `| Request body: ${JSON.stringify(req.body)} ` : '') +
      ((req.query) ? `| Query string: ${JSON.stringify(req.query)} ` : '') +
      ((req.cookies) ? `| Cookies: ${JSON.stringify(req.cookies)}` : ''),
      responseCode: res.statusCode
    }
  }
}
