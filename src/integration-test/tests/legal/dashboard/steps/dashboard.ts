import { ClaimSearchPage } from 'integration-test/tests/legal/dashboard/pages/claim-search'
import { ClaimDetailsPage } from 'integration-test/tests/legal/dashboard/pages/claim-details'

const dashboardSearchPage: ClaimSearchPage = new ClaimSearchPage()
const dashboardClaimDetailsPage: ClaimDetailsPage = new ClaimDetailsPage()

export class DashboardSteps {
  searchAndVerifyClaimDetails (legalClaimNumberText: string): void {
    const extractClaimNumber = legalClaimNumberText.split(' ').pop()
    dashboardSearchPage.open()
    dashboardSearchPage.searchForClaim(extractClaimNumber)
    dashboardClaimDetailsPage.verifyClaimDetails(extractClaimNumber)
  }
}
