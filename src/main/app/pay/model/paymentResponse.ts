import 'reflect-metadata'
import { Expose } from 'class-transformer'
import { ErrorData } from 'pay/model/paymentErrorData'

export class PaymentResponse {

  readonly reference: string

  @Expose({ name: 'date_created' })
  readonly dateCreated: string

  readonly status: string

  readonly errorCode: string

  readonly errorMessage: ErrorData

  readonly errorCodeMessage: string

  get isSuccess (): boolean {
    return this.status === 'Pending'
  }
}
