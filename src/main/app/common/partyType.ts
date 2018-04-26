export class PartyType {
  static readonly ORGANISATION = new PartyType('ORGANISATION', 'organisation')
  static readonly INDIVIDUAL = new PartyType('INDIVIDUAL', 'individual')
  static readonly SOLE_TRADER = new PartyType('SOLE_TRADER', 'soleTrader')
  static readonly CLAIMANT = new PartyType('CLAIMANT', 'party')

  readonly value: string
  readonly dataStoreValue: string

  constructor (value: string, dataStoreValue: string) {
    this.value = value
    this.dataStoreValue = dataStoreValue
  }

  static all (): PartyType[] {
    return [
      PartyType.ORGANISATION,
      PartyType.INDIVIDUAL,
      PartyType.SOLE_TRADER
    ]
  }
}
