import { ForbiddenError } from '../../errors'

export default class OwnershipChecks {

  static checkClaimOwner (userId: number, submitterId: number) {
    if (userId !== submitterId) {
      throw new ForbiddenError()
    }
  }

}
