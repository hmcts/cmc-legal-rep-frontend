export class IndividualTypes {
  static readonly ORGANISATION = new IndividualTypes('ORGANISATION', 'An organisation')
  static readonly INDIVIDUAL = new IndividualTypes('INDIVIDUAL', 'An individual')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): IndividualTypes[] {
    return [
      IndividualTypes.ORGANISATION,
      IndividualTypes.INDIVIDUAL
    ]
  }
}
