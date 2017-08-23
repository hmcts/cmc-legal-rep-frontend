export class GeneralDamages {
  static readonly LESS = 'LESS'
  static readonly MORE = 'MORE'

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
