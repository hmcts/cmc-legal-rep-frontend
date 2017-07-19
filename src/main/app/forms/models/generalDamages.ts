export class GeneralDamages {
  static readonly LESS = new GeneralDamages('LESS', 'less')
  static readonly MORE = new GeneralDamages('MORE', 'more')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): GeneralDamages[] {
    return [
      GeneralDamages.LESS,
      GeneralDamages.MORE
    ]
  }
}
