'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class RetryHelper extends Helper {
  _test(test) {
    const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || 0)
    if (MAX_RETRIES > 0) {
      console.log('Maximum Retries:', MAX_RETRIES)
      test.retries(MAX_RETRIES)
    }
  }
}

module.exports = RetryHelper
