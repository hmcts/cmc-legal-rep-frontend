export class OtherDamages {
  static readonly LESS = new OtherDamages('LESS', 'less', 'thousandPoundsOrLess')
  static readonly MORE = new OtherDamages('MORE', 'more', 'moreThanThousandPounds')
  static readonly NONE = new OtherDamages('NONE', 'none', 'none')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): OtherDamages[] {
    return [
      OtherDamages.LESS,
      OtherDamages.MORE,
      OtherDamages.NONE
    ]
  }
}
