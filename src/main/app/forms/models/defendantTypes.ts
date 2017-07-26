export class DefendantTypes {
  static readonly ORGANISATION = new DefendantTypes('ORGANISATION', 'An organisation')
  static readonly INDIVIDUAL = new DefendantTypes('INDIVIDUAL', 'An individual')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): DefendantTypes[] {
    return [
      DefendantTypes.ORGANISATION,
      DefendantTypes.INDIVIDUAL
    ]
  }
}
