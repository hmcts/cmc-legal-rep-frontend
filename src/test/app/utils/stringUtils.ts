import { expect } from 'chai'

import StringUtils from 'utils/stringUtils'

describe('StringUtils', () => {

  describe('isBlank', () => {
    it('null string is blank', () => {
      const blank = StringUtils.isBlank(null)
      expect(blank).to.be.eq(true)
    })

    it('undefined string is blank', () => {
      const blank = StringUtils.isBlank(undefined)
      expect(blank).to.be.eq(true)
    })

    it('empty string is blank', () => {
      const blank = StringUtils.isBlank('')
      expect(blank).to.be.eq(true)
    })

    it('a given string is not blank', () => {
      const blank = StringUtils.isBlank('test string')
      expect(blank).to.be.eq(false)
    })
  })

})
