import { Address } from 'forms/models/address'
import Representative from 'drafts/models/representative'
import { DefendantDetails } from 'app/forms/models/defendantDetails'
import { DefendantRepresented } from 'app/forms/models/defendantRepresented'
import { ServiceAddress } from 'forms/models/serviceAddress'

export default class Defendant {
  address?: Address = new Address()
  representative?: Representative = new Representative()
  defendantDetails?: DefendantDetails = new DefendantDetails()
  defendantRepresented?: DefendantRepresented = new DefendantRepresented()
  serviceAddress?: ServiceAddress = new ServiceAddress()

  deserialize (input: any): Defendant {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.representative = new Representative().deserialize(input.representative)
      this.defendantDetails = new DefendantDetails().deserialize(input.defendantDetails)
      this.defendantRepresented = new DefendantRepresented().deserialize(input.defendantRepresented)
      this.serviceAddress = new ServiceAddress().deserialize(input.serviceAddress)
    }

    return this
  }
}
