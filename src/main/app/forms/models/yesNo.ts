export class YesNo {
  static readonly YES: string = 'yes'
  static readonly NO: string = 'no'

  static all (): string[] {
    return [
      YesNo.YES,
      YesNo.NO
    ]
  }
}
