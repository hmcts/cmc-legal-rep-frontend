export class ServiceMethod {
  static readonly FIRST_CLASS_POST = new ServiceMethod('firstClassPost', 'First class post')
  static readonly FAX = new ServiceMethod('fax', 'Fax')
  static readonly OTHER_NEXT_DAY = new ServiceMethod('otherNextDay', 'Other next-day delivery service')
  static readonly DOCUMENT_EXCHANGE = new ServiceMethod('DocumentExchange', 'Document Exchange')
  static readonly DELIVERED_OR_LEFT = new ServiceMethod('deliveredOrLeft', 'Delivered or left at a permitted place')
  static readonly PERSONALLY_HANDED = new ServiceMethod('personallyHanded', 'Personally handed to or left with recipient')
  static readonly EMAIL = new ServiceMethod('email', 'Email')
  static readonly OTHER_ELECTRONIC = new ServiceMethod('otherElectronic', 'Other electronic method')
  static readonly OTHER = new ServiceMethod('other', 'Other')

  readonly value: string
  readonly displayValue: string

  constructor (value: string, displayValue: string) {
    this.value = value
    this.displayValue = displayValue
  }

  static all (): ServiceMethod[] {
    return [
      ServiceMethod.FIRST_CLASS_POST,
      ServiceMethod.FAX,
      ServiceMethod.OTHER_NEXT_DAY,
      ServiceMethod.DOCUMENT_EXCHANGE,
      ServiceMethod.DELIVERED_OR_LEFT,
      ServiceMethod.PERSONALLY_HANDED,
      ServiceMethod.EMAIL,
      ServiceMethod.OTHER_ELECTRONIC,
      ServiceMethod.OTHER
    ]
  }
}
