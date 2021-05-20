/* tslint:disable:no-console */

import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class IdamHelper extends codecept_helper {
  async createSolicitorUser (): Promise<string> {
    let email: string
    try {
      email = this.generateRandomEmailAddress()
      await IdamClient.createUser(email)
    } catch (e) {
      console.log(`Error creating user: ${e.message}`)
    }
    return email
  }

  private generateRandomEmailAddress (): string {
    return `civilmoneyclaims+${require('randomstring').generate(7).toLowerCase()}@gmail.com`
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper
