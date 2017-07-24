import { Serializable } from 'models/serializable'
import { Address } from 'forms/models/address'
import CompanyName from 'forms/models/companyName'

export default class Company implements Serializable<Company> {
  address: Address
  companyName: CompanyName

  deserialize (input: any): Company {
    if (input) {
      this.address = new Address().deserialize(input.address)
      this.companyName = new CompanyName().deserialize(input.companyName)
    }
    return this
  }

}
