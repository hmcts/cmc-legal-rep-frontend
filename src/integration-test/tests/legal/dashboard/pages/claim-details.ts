import { verifyPageData } from 'integration-test/data/legal-test-data'

import I = CodeceptJS.I

const I: I = actor()

export class ClaimDetailsPage {
  open () {
    I.amOnLegalAppPage('/dashboard/claim-details')
  }

  verifyClaimDetails (legalClaimNumber) {
    I.see(legalClaimNumber)
    I.see(verifyPageData.claimantOrganization)
    I.see(verifyPageData.defendantOrganization)
    I.see(verifyPageData.organizationRefNumber)
    I.click('Download the sealed claim form')
  }
}
