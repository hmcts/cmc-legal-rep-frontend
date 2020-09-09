import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import I = CodeceptJS.I

const userSteps: UserSteps = new UserSteps()

Feature('Claimant Enter details of claim')

Before(async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
})

Scenario('I can fill in two claimants and update their details @legal', async (I: I) => {
  userSteps.enterClaimantTypeIndividual()
  I.see('Claimant: Mr Benugo')
  userSteps.enterClaimantAddress()
  userSteps.addAdditionalClaimant()
  userSteps.enterClaimantTypeIndividual()
  I.see('Claimant 2: Mr Benugo')
  userSteps.enterClaimantAddress()
  userSteps.verifyAndChangeClaimantDetails()
})

Scenario('I can save organisation details and populate them in a subsequent claim via cookie info @legal', async () => {
  userSteps.startClaim()
  userSteps.verifyOrganizationDetails()
})
