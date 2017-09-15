import Claim from 'claims/models/claim'
import { MomentFactory } from 'common/momentFactory'
import { expect } from 'chai'

const claim = new Claim()

describe('Claim', () => {

  context('remainingDays = 0', () => {
    before('setup', () => {
      claim.responseDeadline = MomentFactory.currentDate()
    })
    it('should return 0', () => {
      expect(claim.remainingDays).to.be.equal(0)
    })
  })
  context('remainingDays > 0', () => {
    before('setup', () => {
      claim.responseDeadline = MomentFactory.currentDate().add(1, 'day')
    })

    it('should return 1', () => {
      expect(claim.remainingDays).to.be.equal(1)
    })
  })
})
