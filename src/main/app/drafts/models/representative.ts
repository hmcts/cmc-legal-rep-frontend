import { Serializable } from 'models/serializable'
import Company from 'drafts/models/company'

export default class Representative implements Serializable<Representative> {
  company: Company

  deserialize (input: any): Representative {
    if (input) {
      this.company = new Company().deserialize( input.company )
    }
    return this
  }

}
