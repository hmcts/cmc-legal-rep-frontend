import I = CodeceptJS.I

import { verifyPageData } from 'integration-test/data/legal-test-data'

import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import { DefendantSteps } from 'integration-test/tests/legal/defence/steps/defendant'

const userSteps: UserSteps = new UserSteps()
const defendantSteps: DefendantSteps = new DefendantSteps()

Feature('Defendants Enter details of claim')

Before(async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
})

Scenario('I can fill in Claimant organization, more Defendant details and update their details @legal', async (I: I) => {
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
  defendantSteps.enterAnotherDefendant()
  defendantSteps.enterAnotherDefendantTypeIndividual()
  I.see('Defendant 2: Mrs Orange')
  defendantSteps.enterDefendantAddress()
  defendantSteps.noDefendantCompanyName()
  defendantSteps.enterServiceAddress()
  defendantSteps.enterAnotherDefendant()
  defendantSteps.enterAnotherDefendantTypeOrganisation()
  I.see('Defendant 3: Ghi corporation')
  defendantSteps.enterDefendantAddress()
  defendantSteps.enterDefendantRepsCompanyName()
  I.see("Defendant 3's legal representative: Defendant Rep Ltd")
  defendantSteps.enterDefendantRepsAddress()
  defendantSteps.verifyAndChangeDefendantDetails()
})

Scenario('I can fill in Claimant individual and Defendant individual details @legal', async (I: I) => {
  userSteps.enterClaimantTypeIndividual()
  I.see('Claimant: Mr Benugo')
  userSteps.enterClaimantAddress()
  userSteps.noAdditionalClaimant()
  defendantSteps.enterDefendantTypeIndividual()
  I.see('Defendant: Mr Pret')
  defendantSteps.enterDefendantAddress()
  defendantSteps.noDefendantCompanyName()
  defendantSteps.defendantAddressAsServiceAddress()
  defendantSteps.noAnotherDefendant()
})
