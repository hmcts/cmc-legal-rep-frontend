const DEFAULT_PASSWORD = require('../../../../data/test-data').DEFAULT_PASSWORD

import { LoginPage } from '../pages/login'
import { ClaimantStartClaimPage } from '../../claim/pages/claimant-start-claim'
import { ClaimantRepresentativeNamePage } from '../../claim/pages/claimant-representative-name'
import { ClaimantRepresentativeAddressPage } from '../../claim/pages/claimant-representative-address'
import { ClaimantRepresentativeContactsPage } from '../../claim/pages/claimant-representative-contacts'
import { ClaimantReferencePage } from '../../claim/pages/claimant-reference'
import { ClaimantPreferredCourtPage } from '../../claim/pages/claimant-preferred-court'
import { ClaimantTypePage } from '../../claim/pages/claimant-type'
import { ClaimantAddressPage } from '../../claim/pages/claimant-address'
import { ClaimantAddPage } from '../../claim/pages/claimant-add'

const loginPage: LoginPage = new LoginPage()
const startClaimPage: ClaimantStartClaimPage = new ClaimantStartClaimPage()
const yourOrganisationNamePage: ClaimantRepresentativeNamePage = new ClaimantRepresentativeNamePage()
const yourOrganisationAddressPage: ClaimantRepresentativeAddressPage = new ClaimantRepresentativeAddressPage()
const yourContactDetailsPage: ClaimantRepresentativeContactsPage = new ClaimantRepresentativeContactsPage()
const yourReferencePage: ClaimantReferencePage = new ClaimantReferencePage()
const yourCountyCourtPage: ClaimantPreferredCourtPage = new ClaimantPreferredCourtPage()
const claimantTypePage: ClaimantTypePage = new ClaimantTypePage()
const claimantAddressPage: ClaimantAddressPage = new ClaimantAddressPage()
const claimantAddPage: ClaimantAddPage = new ClaimantAddPage()

export class UserSteps {
  loginUser (userEmail, password) {
    loginPage.open()
    loginPage.login(userEmail, password || DEFAULT_PASSWORD)
  }

  startClaim () {
    startClaimPage.open()
    startClaimPage.startClaim()
  }

  loginAndStartClaim (userEmail, password) {
    this.loginUser(userEmail, password)
    this.startClaim()
  }

  enterYourOrganisationNamePage () {
    yourOrganisationNamePage.enterYourOrganisationName()
  }

  enterYourOrganisationAddress () {
    yourOrganisationAddressPage.enterYourOrganisationAddress()
  }

  enterYourOrganisationContactDetails () {
    yourContactDetailsPage.enterYourOrganisationContactDetails()
  }

  enterYourReferenceNumber () {
    yourReferencePage.enterYourReferenceForClaim()
  }

  enterYourPreferredCountyCourt () {
    yourCountyCourtPage.enterYourPreferredCountyCourt()
  }

  enterClaimantServiceDetails () {
    yourOrganisationNamePage.enterYourOrganisationName()
    yourOrganisationAddressPage.enterYourOrganisationAddress()
    yourContactDetailsPage.enterYourOrganisationContactDetails()
    yourReferencePage.enterYourReferenceForClaim()
    yourCountyCourtPage.enterYourPreferredCountyCourt()
  }

  enterMandatoryClaimantServiceDetails () {
    yourOrganisationNamePage.enterYourOrganisationName()
    yourOrganisationAddressPage.enterOnlyMandatoryOrganisationAddress()
    yourContactDetailsPage.submitOnlyMandatoryData()
    yourReferencePage.submitOnlyMandatoryData()
    yourCountyCourtPage.submitOnlyMandatoryData()
    claimantTypePage.enterOnlyMandatoryClaimantTypeData()
  }

  enterMandatoryClaimantAddressDetails () {
    claimantAddressPage.enterMandatoryClaimantOrganisationAddress()
  }

  enterClaimantTypeIndividual () {
    claimantTypePage.enterClaimantTypeIndividual()
  }

  enterClaimantTypeOrganisation () {
    claimantTypePage.enterClaimantTypeOrganisation()
  }

  enterClaimantAddress () {
    claimantAddressPage.enterYourOrganisationAddress()
  }

  addAdditionalClaimant () {
    claimantAddPage.enterAdditionalClaimant()
  }

  noAdditionalClaimant () {
    claimantAddPage.chooseNoAdditionalClaimant()
  }

  verifyOrganizationDetails () {
    yourOrganisationNamePage.verifyOrganizationName()
    yourOrganisationAddressPage.verifyOrganizationAddress()
    yourContactDetailsPage.verifyContactDetails()
  }

  verifyAndChangeClaimantDetails () {
    claimantTypePage.verifyClaimantIndividualDetails()
    claimantTypePage.changeRemoveIndividualClaimantDetails()
  }
}
