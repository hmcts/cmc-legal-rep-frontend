export class RangeFee {
  constructor (public type: string, public code: string, public description: string, public amount: number) {
    this.type = type
    this.code = code
    this.description = description
    this.amount = amount
  }
}
