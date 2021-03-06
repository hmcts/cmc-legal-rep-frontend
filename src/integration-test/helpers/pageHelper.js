'use strict'
/* globals codecept_helper */

function normalizeURL (url) {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1)
  } else {
    return url
  }
}

const legalAppBaseURL = normalizeURL(process.env.LEGAL_APP_URL || 'https://localhost:4000')

// eslint-disable-next-line camelcase
let Helper = codecept_helper

// eslint-disable-next-line no-unused-vars
class PageHelper extends Helper {
  amOnLegalAppPage (path) {
    return this.helpers['WebDriver'].amOnPage(`${legalAppBaseURL}${path}`)
  }

  async waitForLegalAppPage (path = '', sec) {
    const helper = this.helpers['WebDriver']
    const timeout = sec || helper.options.waitForTimeout
    return helper.waitForText('Issue civil court proceedings', timeout, 'h1')
  }
}

module.exports = PageHelper
