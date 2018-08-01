import { IdamClient } from 'integration-test/helpers/clients/idamClient'

class IdamHelper extends codecept_helper {
  createSolicitorUser (): Promise<string> {
    return this.createRandomUser('cmc-solicitor')
  }

  private async createRandomUser (userGroupCode: string): Promise<string> {
    const email: string = this.generateRandomEmailAddress()
    /* tslint:disable:no-console */
    console.log('Creating user: ' + email + ' with userGroupCode: ' + userGroupCode)
    await IdamClient.createUser(email, userGroupCode)
    return email
  }

  private generateRandomEmailAddress (): string {
    return `civilmoneyclaims+${require('randomstring').generate(7).toLowerCase()}@gmail.com`
  }
}

// Node.js style export is required by CodeceptJS framework
module.exports = IdamHelper
