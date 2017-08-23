export class YesNo {
  static readonly YES = 'YES'
  static readonly NO = 'NO'

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): string[] {
    return [
      YesNo.YES,
      YesNo.NO
    ]
  }
}
