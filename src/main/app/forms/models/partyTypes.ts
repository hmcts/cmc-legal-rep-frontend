export class PartyTypes {
  static readonly ORGANISATION = new PartyTypes('ORGANISATION', 'An organisation', 'organisation')
  static readonly INDIVIDUAL = new PartyTypes('INDIVIDUAL', 'An individual', 'individual')
  static readonly CLAIMANT = new PartyTypes('CLAIMANT', 'A claimant', 'claimant')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue: string) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): PartyTypes[] {
    return [
      PartyTypes.ORGANISATION,
      PartyTypes.INDIVIDUAL,
      PartyTypes.CLAIMANT
    ]
  }
}
