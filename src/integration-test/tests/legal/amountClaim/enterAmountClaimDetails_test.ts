import I = CodeceptJS.I

import { verifyPageData } from 'integration-test/data/legal-test-data'

import { SMOKE_TEST_SOLICITOR_USERNAME, SMOKE_TEST_USER_PASSWORD } from 'integration-test/data/test-data'

import { AmountClaimSteps } from 'integration-test/tests/legal/amountClaim/steps/amountClaims'
import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import { DefendantSteps } from 'integration-test/tests/legal/defence/steps/defendant'
import { DashboardSteps } from 'integration-test/tests/legal/dashboard/steps/dashboard'

const amountClaimSteps: AmountClaimSteps = new AmountClaimSteps()
const userSteps: UserSteps = new UserSteps()
const defendantSteps: DefendantSteps = new DefendantSteps()
const dashboardSteps: DashboardSteps = new DashboardSteps()

Feature('Enter claim amount and submit claim')

Scenario('I can fill in Organisation details for Claimant, Defendant, Claim amount and Submit the claim @legal @quick', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
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
  amountClaimSteps.addRangeDetailsAndVerifyOrganisationDetails()
  let dateCheck = await I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
  let legalClaimNumberText = await I.grabTextFrom('h2.bold-medium.reference-number')
  dashboardSteps.searchAndVerifyClaimDetails(legalClaimNumberText)
})

Scenario('I can fill only mandatory fields and submit the claim @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterMandatoryClaimantServiceDetails()
  userSteps.enterMandatoryClaimantAddressDetails()
  userSteps.noAdditionalClaimant()
  defendantSteps.enterMandatoryDefendantDetails()
  defendantSteps.enterDefendantRepsCompanyName()
  defendantSteps.enterDefendantRepsAddress()
  defendantSteps.noAnotherDefendant()
  amountClaimSteps.addMandatoryClaimDataAndSubmitClaim()
  let dateCheck = await I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
})

Scenario('I can fill in individual details for Claimant, Defendant, Claim amount and Submit the claim @legal @quick', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
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
  amountClaimSteps.addRangeDetailsAndVerifyIndividualDetails()
  let dateCheck = await I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
  const pdfUrl = await I.grabAttributeFrom('ol li a', 'href')
  const sessionCookie = await I.grabCookie('T2_SESSION_ID')
  await I.downloadPDF(pdfUrl, sessionCookie.value)
})

Scenario('I can fill in Organisation details for Claimant, Defendant and no Claim amount details @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  userSteps.enterClaimantServiceDetails()
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
  amountClaimSteps.addNoClaimDataAndVerifyData()
})

Scenario('Check personal injury more than 1000 @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  amountClaimSteps.personalInjuryMoreThan1000()
  I.seeInCurrentUrl('housing-disrepair')
})

Scenario('Check housing disrepair more than 1000 @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  amountClaimSteps.housingDisrepairMoreThan1000()
  I.seeInCurrentUrl('summarise-the-claim')
})

Scenario('Check housing disrepair less than 1000 and no other damages @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  amountClaimSteps.housingDisrepairLessThan1000AndNoOtherDamages()
  I.seeInCurrentUrl('summarise-the-claim')
})

Scenario('Check higher value in amount claim Page @legal', async (I: I) => {
  const userEmail = await I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail)
  amountClaimSteps.enterOnlyHigherValueAmount()
  I.seeInCurrentUrl('total')
})

Scenario('I can fill both Claimant, Defendant details move up to submit claim @smoke-test', async (I: I) => {
  userSteps.loginAndStartClaim(SMOKE_TEST_SOLICITOR_USERNAME, SMOKE_TEST_USER_PASSWORD)
  userSteps.enterClaimantServiceDetails()
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
