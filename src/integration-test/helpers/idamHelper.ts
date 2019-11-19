import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class IdamHelper extends codecept_helper {
  createSolicitorUser (): Promise<string> {
    return this.createRandomUser()
  }

  private async createRandomUser (): Promise<string> {
    const email: string = this.generateRandomEmailAddress()
    await IdamClient.createUser(email, process.env.SMOKE_TEST_USER_PASSWORD)
    return email
  }

  private generateRandomEmailAddress (): string {
    return `civilmoneyclaims+${require('randomstring').generate(7).toLowerCase()}@gmail.com`
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper
