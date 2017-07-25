import Summary from 'forms/models/summary'
import Name from 'app/forms/models/name'

export default class Claimant {
  summary: Summary = new Summary()
  name: Name = new Name()

  deserialize (input: any): Claimant {
    if (input) {
      this.summary = new Summary().deserialize(input.summary)
      this.name = new Name().deserialize(input.name)
    }
    return this
  }
}
