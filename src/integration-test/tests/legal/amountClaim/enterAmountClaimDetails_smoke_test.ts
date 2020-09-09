import I = CodeceptJS.I

import { verifyPageData } from 'integration-test/data/legal-test-data'

import { AmountClaimSteps } from 'integration-test/tests/legal/amountClaim/steps/amountClaims'
import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import { DefendantSteps } from 'integration-test/tests/legal/defence/steps/defendant'

const amountClaimSteps: AmountClaimSteps = new AmountClaimSteps()
const userSteps: UserSteps = new UserSteps()
const defendantSteps: DefendantSteps = new DefendantSteps()

Feature('Enter claim amount and submit claim (smoke)')

Before(async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
})
Scenario('I can fill both Claimant, Defendant details move up to submit claim @smoke-test', async (I: I) => {
  // commenting below as there are not variables set yet. Creating a random solicitor for now in "Before"
  // userSteps.loginAndStartClaim(SMOKE_TEST_SOLICITOR_USERNAME, SMOKE_TEST_USER_PASSWORD)
  // userSteps.enterClaimantServiceDetails()
  userSteps.enterClaimantTypeOrganisation()
  I.see('Claimant: ' + verifyPageData.claimantOrganization)
  userSteps.enterClaimantAddress()
  userSteps.noAdditionalClaimant()
  defendantSteps.enterDefendantTypeOrganisation()
  I.see('Defendant: ' + verifyPageData.defendantOrganization)
  defendantSteps.enterDefendantAddress()
  defendantSteps.enterDefendantRepsCompanyName()
  I.see("Defendant's legal representative: Defendant Rep Ltd")
  defendantSteps.enterDefendantRepsAddress()
  defendantSteps.noAnotherDefendant()
  amountClaimSteps.addAmountAndVerifyDetails()
  I.see('Pay by Fee Account')
})
