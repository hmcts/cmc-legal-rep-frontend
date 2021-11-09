import I = CodeceptJS.I

import { verifyPageData } from 'integration-test/data/legal-test-data'

import { AmountClaimSteps } from 'integration-test/tests/legal/amountClaim/steps/amountClaims'
import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import { DefendantSteps } from 'integration-test/tests/legal/defence/steps/defendant'

const amountClaimSteps: AmountClaimSteps = new AmountClaimSteps()
const userSteps: UserSteps = new UserSteps()
const defendantSteps: DefendantSteps = new DefendantSteps()
let userEmail: string
Feature('Enter claim amount and submit claim (smoke)')

Before(async (I: I) => {
  userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
})
Scenario('I can fill both Claimant, Defendant details move up to submit claim @smoke-test', async (I: I) => {
  // commenting below as there are not variables set yet. Creating a random solicitor for now in "Before"
  // userSteps.loginAndStartClaim(SMOKE_TEST_SOLICITOR_USERNAME, SMOKE_TEST_USER_PASSWORD)
  // userSteps.enterClaimantServiceDetails()
  userSteps.enterClaimantTypeOrganisation()
  I.waitForText('Claimant: ' + verifyPageData.claimantOrganization)
  userSteps.enterClaimantAddress()
  userSteps.noAdditionalClaimant()
  defendantSteps.enterDefendantTypeOrganisation()
  I.waitForText('Defendant: ' + verifyPageData.defendantOrganization)
  defendantSteps.enterDefendantAddress()
  defendantSteps.enterDefendantRepsCompanyName()
  I.waitForText("Defendant's legal representative: Defendant Rep Ltd")
  defendantSteps.enterDefendantRepsAddress()
  defendantSteps.noAnotherDefendant()
  amountClaimSteps.addAmountAndVerifyDetails()
  I.waitForText('Pay by Fee Account')
}).retry(2)

After(async (I: I) => {
  await I.deleteUser(userEmail)
})
