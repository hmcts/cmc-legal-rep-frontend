import { expect } from 'chai'

import OwnershipChecks from 'app/auth/ownershipChecks'

describe('OwnershipChecks', () => {
  describe('checkClaimOwner', () => {
    it('should throw error when the user is not an owner of the claim', () => {
      expect(() => OwnershipChecks.checkClaimOwner(1, 2)).to.throw(Error, 'You are not allowed to access this resource')
    })

    it('should not throw error when the user is owner the claim', () => {
      expect(() => OwnershipChecks.checkClaimOwner(1, 1)).not.to.throw()
    })
  })
})
