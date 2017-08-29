export class GeneralDamages {
  static readonly LESS = new GeneralDamages('LESS', 'less', 'thousandPoundsOrLess')
  static readonly MORE = new GeneralDamages('MORE', 'more', 'moreThanThousandPounds')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): GeneralDamages[] {
    return [
      GeneralDamages.LESS,
      GeneralDamages.MORE
    ]
  }
}
