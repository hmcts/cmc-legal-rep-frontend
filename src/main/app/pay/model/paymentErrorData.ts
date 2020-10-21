import { Expose } from 'class-transformer'
import { StatusHistories } from 'pay/model/paymentErrorResponse'

export class ErrorData {
    @Expose({ name: 'status_histories' })
    readonly StatusHistories: Array<StatusHistories>
    readonly date_created: string
    readonly payment_group_reference: string
    readonly reference: string
    readonly status: string
  }