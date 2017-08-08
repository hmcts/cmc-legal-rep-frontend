import { expect } from 'chai'
import './mocks'

import FeesClient from 'fees/feesClient'

describe('FeesClient', () => {
  it('should return issue fee for given claim value', async () => {
    const amount = await FeesClient.calculateIssueFee(33)
    expect(amount).to.equal(100)
  })

  it('should return issue fee for given claim value', async () => {
    const amount = await FeesClient.calculateMaxIssueFee()
    expect(amount).to.equal(1000000)
  })
})
