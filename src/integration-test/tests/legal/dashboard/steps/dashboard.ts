import { ClaimSearchPage } from 'integration-test/tests/legal/dashboard/pages/claim-search'
import { ClaimDetailsPage } from 'integration-test/tests/legal/dashboard/pages/claim-details'

const dashboardSearchPage: ClaimSearchPage = new ClaimSearchPage()
const dashboardClaimDetailsPage: ClaimDetailsPage = new ClaimDetailsPage()

export class DashboardSteps {
  // todo, not used
  openPage () {
    dashboardSearchPage.open()
    dashboardClaimDetailsPage.open()
  }

  // todo, not used
  searchAndVerifyClaimDetails (legalClaimNumberText) {
    const extractClaimNumber = legalClaimNumberText.split(' ').pop()
    dashboardSearchPage.open()
    dashboardSearchPage.searchForClaim(extractClaimNumber)
    dashboardClaimDetailsPage.verifyClaimDetails(extractClaimNumber)
  }
}
