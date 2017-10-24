import 'reflect-metadata'
import { Type } from 'class-transformer'
import { Fee } from 'fees/model/fee'

export class FeeResponse {
  readonly amount: number
  @Type(() => Fee)
  readonly fee: Fee

  constructor (amount: number, fee: Fee) {
    this.amount = amount
    this.fee = fee
  }
}
