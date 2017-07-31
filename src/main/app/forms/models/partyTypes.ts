export class PartyTypes {
  static readonly ORGANISATION = new PartyTypes('ORGANISATION', 'An organisation')
  static readonly INDIVIDUAL = new PartyTypes('INDIVIDUAL', 'An individual')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): PartyTypes[] {
    return [
      PartyTypes.ORGANISATION,
      PartyTypes.INDIVIDUAL
    ]
  }
}
