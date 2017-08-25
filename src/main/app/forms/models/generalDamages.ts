export class GeneralDamages {
  static readonly LESS = 'thousandPoundsOrLess'
  static readonly MORE = 'moreThanThousandPounds'

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): string[] {
    return [
      GeneralDamages.LESS,
      GeneralDamages.MORE
    ]
  }
}
