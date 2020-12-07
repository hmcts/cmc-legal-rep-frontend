import { Expose } from 'class-transformer'
import { StatusHistories } from 'pay/model/paymentErrorResponse'

export class ErrorData {
  @Expose({ name: 'status_histories' })
  readonly StatusHistories: Array<StatusHistories>
  @Expose({ name: 'date_created' })
  readonly DateCreated: string
  @Expose({ name: 'payment_group_reference' })
  readonly PaymentGroupReference: string
  readonly reference: string
  readonly status: string
}
