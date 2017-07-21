import * as moment from 'moment'
import { Moment } from 'moment'

export default class Claimant {
  dateOfBirth: Moment

  deserialize (input: any): Claimant {
    if (input) {
      this.dateOfBirth = moment(input.dateOfBirth)
    }
    return this
  }
}
