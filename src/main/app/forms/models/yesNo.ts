export class YesNo {
  static readonly YES = new YesNo('YES', 'yes')
  static readonly NO = new YesNo('NO', 'no')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): YesNo[] {
    return [
      YesNo.YES,
      YesNo.NO
    ]
  }
}
