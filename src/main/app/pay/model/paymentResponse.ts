import 'reflect-metadata'
import { Expose } from 'class-transformer'
import { StatusHistories } from 'pay/model/paymentErrorResponse'

export class PaymentResponse {

  readonly reference: string

  @Expose({ name: 'date_created' })
  readonly dateCreated: string

  readonly status: string

  readonly errorCode: string

  readonly errorMessage: string

  @Expose({ name: 'status_histories' })
  readonly statusHistories: Array<StatusHistories>

  get isSuccess (): boolean {
    return this.status === 'Success'
  }
}
