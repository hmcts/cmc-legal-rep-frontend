import User from 'app/idam/user'
import Claim from 'app/claims/models/claim'

export default class OwnershipChecks {

  static checkClaimOwner (user: User, claim: Claim) {
    if (user.id !== claim.submitterId) {
      throw new Error('You are not allowed to access this resource')
    }
  }

}
