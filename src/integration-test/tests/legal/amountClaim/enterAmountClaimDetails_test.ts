import I = CodeceptJS.I

const verifyPageData = require('../../../data/legal-test-data').verifyPageData
const SMOKE_TEST_SOLICITOR_USERNAME = require('../../../data/test-data').SMOKE_TEST_SOLICITOR_USERNAME
const SMOKE_TEST_USER_PASSWORD = require('../../../data/test-data').SMOKE_TEST_USER_PASSWORD

import { AmountClaimSteps } from 'integration-test/tests/legal/amountClaim/steps/amountClaims'
import { UserSteps } from 'integration-test/tests/legal/home/steps/user'
import { DefendantSteps } from 'integration-test/tests/legal/defence/steps/defendant'

const amountClaimSteps: AmountClaimSteps = new AmountClaimSteps()
const userSteps: UserSteps = new UserSteps()
const defendantSteps: DefendantSteps = new DefendantSteps()

Feature('Enter claim amount and submit claim')

Scenario('I can fill in Organisation details for Claimant, Defendant, Claim amount and Submit the claim @legal @quick', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
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
  let dateCheck = yield I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
  // let legalClaimNumberText = yield I.grabTextFrom('h2.bold-medium.reference-number')
  // legalDashboardSteps.searchAndVerifyClaimDetails(legalClaimNumberText)
})

Scenario('I can fill only mandatory fields and submit the claim @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
  userSteps.enterMandatoryClaimantServiceDetails()
  userSteps.enterMandatoryClaimantAddressDetails()
  userSteps.noAdditionalClaimant()
  defendantSteps.enterMandatoryDefendantDetails()
  defendantSteps.enterDefendantRepsCompanyName()
  defendantSteps.enterDefendantRepsAddress()
  defendantSteps.noAnotherDefendant()
  amountClaimSteps.addMandatoryClaimDataAndSubmitClaim()
  let dateCheck = yield I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
})

Scenario('I can fill in individual details for Claimant, Defendant, Claim amount and Submit the claim @legal @quick', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
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
  let dateCheck = yield I.grabTextFrom('div.confirmation-detail')
  amountClaimSteps.verifySubmittedPage(userEmail, dateCheck)
  const pdfUrl = yield I.grabAttributeFrom('ol li a', 'href')
  const sessionCookie = yield I.grabCookie('T2_SESSION_ID')
  yield I.downloadPDF(pdfUrl, sessionCookie.value)
})

Scenario('I can fill in Organisation details for Claimant, Defendant and no Claim amount details @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
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

Scenario('Check personal injury more than 1000 @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
  amountClaimSteps.personalInjuryMoreThan1000()
  I.seeInCurrentUrl('housing-disrepair')
})

Scenario('Check housing disrepair more than 1000 @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
  amountClaimSteps.housingDisrepairMoreThan1000()
  I.seeInCurrentUrl('summarise-the-claim')
})

Scenario('Check housing disrepair less than 1000 and no other damages @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
  amountClaimSteps.housingDisrepairLessThan1000AndNoOtherDamages()
  I.seeInCurrentUrl('summarise-the-claim')
})

Scenario('Check higher value in amount claim Page @legal', function* (I: I) {
  const userEmail = yield I.createSolicitorUser()
  userSteps.loginAndStartClaim(userEmail, '')
  amountClaimSteps.enterOnlyHigherValueAmount()
  I.seeInCurrentUrl('total')
})

Scenario('I can fill both Claimant, Defendant details move up to submit claim @legal-smoke-test', function* (I: I) {
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
