'use strict'
/* globals codecept_helper */

// eslint-disable-next-line no-unused-vars
class RetryHelper extends Helper {
  _test(test) {
    // test.retries(2)
    test.retries(1)
  }
}

module.exports = RetryHelper
