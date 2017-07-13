export class GeneralDamages {
  static readonly LESS: string = 'less'
  static readonly MORE: string = 'more'

  static all (): string[] {
    return [
      GeneralDamages.LESS,
      GeneralDamages.MORE
    ]
  }
}
