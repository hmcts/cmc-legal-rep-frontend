import { DefendantTypePage } from 'integration-test/tests/legal/defence/pages/defendant-type'
import { DefendantAddressPage } from 'integration-test/tests/legal/defence/pages/defendant-address'
import { DefendantRepresentedPage } from 'integration-test/tests/legal/defence/pages/defendant-represented'
import { DefendantRepsAddressPage } from 'integration-test/tests/legal/defence/pages/defendant-reps-address'
import { DefendantAddPage } from 'integration-test/tests/legal/defence/pages/defendant-add'
import { DefendantServiceAddressPage } from 'integration-test/tests/legal/defence/pages/defendant-service-address'

const defendantTypePage: DefendantTypePage = new DefendantTypePage()
const defendantAddressPage: DefendantAddressPage = new DefendantAddressPage()
const defendantRepresentativePage: DefendantRepresentedPage = new DefendantRepresentedPage()
const defendantRepresentativeAddressPage: DefendantRepsAddressPage = new DefendantRepsAddressPage()
const defendantAddAnotherDefendantPage: DefendantAddPage = new DefendantAddPage()
const defendantServiceAddressPage: DefendantServiceAddressPage = new DefendantServiceAddressPage()

export class DefendantSteps {
  enterDefendantTypeIndividual () {
    defendantTypePage.enterDefendantTypeIndividual()
  }

  enterDefendantTypeOrganisation () {
    defendantTypePage.enterDefendantTypeOrganisation()
  }

  enterMandatoryDefendantDetails () {
    defendantTypePage.enterOnlyMandatoryDefendantTypeDetails()
    defendantAddressPage.enterOnlyMandatoryDefendantOrganisationAddress()
  }

  enterAnotherDefendantTypeIndividual () {
    defendantTypePage.enterAnotherDefendantTypeIndividual()
  }

  enterAnotherDefendantTypeOrganisation () {
    defendantTypePage.enterAnotherDefendantTypeOrganisation()
  }

  enterDefendantAddress () {
    defendantAddressPage.enterYourOrganisationAddress()
  }

  enterDefendantRepsCompanyName () {
    defendantRepresentativePage.enterDefendantCompanyName()
  }

  noDefendantCompanyName () {
    defendantRepresentativePage.noDefendantCompanyName()
  }

  enterDefendantRepsAddress () {
    defendantRepresentativeAddressPage.enterDefendantRepsCompanyAddress()
  }

  enterAnotherDefendant () {
    defendantAddAnotherDefendantPage.enterAnotherDefendant()
  }

  noAnotherDefendant () {
    defendantAddAnotherDefendantPage.noAnotherDefendant()
  }

  enterServiceAddress () {
    defendantServiceAddressPage.enterAnotherServiceAddress()
  }

  defendantAddressAsServiceAddress () {
    defendantServiceAddressPage.useDefendantAddressAsServiceAddress()
  }

  verifyAndChangeDefendantDetails () {
    defendantTypePage.verifyDefendantOrganisationDetails()
    defendantTypePage.changeRemoveIndividualDefendantDetails()
  }
}
