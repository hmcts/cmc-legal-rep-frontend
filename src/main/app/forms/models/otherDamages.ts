export class OtherDamages {
  static readonly LESS = new OtherDamages('LESS', 'less')
  static readonly MORE = new OtherDamages('MORE', 'more')
  static readonly NONE = new OtherDamages('NONE', 'none')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): OtherDamages[] {
    return [
      OtherDamages.LESS,
      OtherDamages.MORE,
      OtherDamages.NONE
    ]
  }
}
