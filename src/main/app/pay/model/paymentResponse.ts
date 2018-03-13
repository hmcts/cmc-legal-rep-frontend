import 'reflect-metadata'
import { Expose } from 'class-transformer'

export class PaymentResponse {

  readonly reference: string

  @Expose({ name: 'date_created' })
  readonly dateCreated: string

  readonly status: string

  get isSuccess (): boolean {
    return this.status === 'Pending'
  }
}
