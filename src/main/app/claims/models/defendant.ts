import { Party } from 'app/claims/models/party'

export class Defendant extends Party {
  email?: string

  deserialize (input: any): Defendant {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      if (input.email) {
        this.email = input.email
      }
    }
    return this
  }
}
