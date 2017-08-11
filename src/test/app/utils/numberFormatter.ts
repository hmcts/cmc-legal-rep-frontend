import { expect } from 'chai'
import * as numeral from 'numeral'
import 'numeral/locales/en-gb'

import { NumberFormatter } from 'app/utils/numberFormatter'

describe('NumberFormatter', () => {
  numeral.locale('en-gb')

  describe('formatMoney', () => {

    it('format numeric value to money', () => {
      expect(NumberFormatter.formatMoney(10.01)).to.eq('£10.01')
    })

    it('format numeric value to money without decimal places', () => {
      expect(NumberFormatter.formatMoney(10)).to.eq('£10')
    })

    it('format numeric value to money without decimal places having .00', () => {
      expect(NumberFormatter.formatMoney(10.00)).to.eq('£10')
    })

  })
})
