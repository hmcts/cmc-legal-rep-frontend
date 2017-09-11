export class OtherDamages {
  static readonly LESS = 'thousandPoundsOrLess'
  static readonly MORE = 'moreThanThousandPounds'
  static readonly NONE = 'none'

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): string[] {
    return [
      OtherDamages.LESS,
      OtherDamages.MORE,
      OtherDamages.NONE
    ]
  }
}
