export class OtherDamages {
  static readonly LESS = 'LESS'
  static readonly MORE = 'MORE'
  static readonly NONE = 'NONE'

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
