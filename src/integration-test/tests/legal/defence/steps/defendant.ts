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
  enterDefendantTypeIndividual (): void {
    defendantTypePage.enterDefendantTypeIndividual()
  }

  enterDefendantTypeOrganisation (): void {
    defendantTypePage.enterDefendantTypeOrganisation()
  }

  enterMandatoryDefendantDetails (): void {
    defendantTypePage.enterOnlyMandatoryDefendantTypeDetails()
    defendantAddressPage.enterOnlyMandatoryDefendantOrganisationAddress()
  }

  enterAnotherDefendantTypeIndividual (): void {
    defendantTypePage.enterAnotherDefendantTypeIndividual()
  }

  enterAnotherDefendantTypeOrganisation (): void {
    defendantTypePage.enterAnotherDefendantTypeOrganisation()
  }

  enterDefendantAddress (): void {
    defendantAddressPage.enterYourOrganisationAddress()
  }

  enterDefendantRepsCompanyName (): void {
    defendantRepresentativePage.enterDefendantCompanyName()
  }

  noDefendantCompanyName (): void {
    defendantRepresentativePage.noDefendantCompanyName()
  }

  enterDefendantRepsAddress (): void {
    defendantRepresentativeAddressPage.enterDefendantRepsCompanyAddress()
  }

  enterAnotherDefendant (): void {
    defendantAddAnotherDefendantPage.enterAnotherDefendant()
  }

  noAnotherDefendant (): void {
    defendantAddAnotherDefendantPage.noAnotherDefendant()
  }

  enterServiceAddress (): void {
    defendantServiceAddressPage.enterAnotherServiceAddress()
  }

  defendantAddressAsServiceAddress (): void {
    defendantServiceAddressPage.useDefendantAddressAsServiceAddress()
  }

  verifyAndChangeDefendantDetails (): void {
    defendantTypePage.verifyDefendantOrganisationDetails()
    defendantTypePage.changeRemoveIndividualDefendantDetails()
  }
}
