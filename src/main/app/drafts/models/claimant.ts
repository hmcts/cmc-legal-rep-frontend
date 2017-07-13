import Summary from 'forms/models/summary'

export default class Claimant {
  summary: Summary = new Summary()

  deserialize (input: any): Claimant {
    if (input) {
      this.summary = new Summary().deserialize(input.summary)
    }
    return this
  }
}
