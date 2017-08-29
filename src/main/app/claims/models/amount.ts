import { Serializable } from 'models/serializable'

export class Amount implements Serializable<Amount> {
  type?: string
  lowerValue?: number
  higherValue?: number

  deserialize (input?: any): Amount {
    if (input) {
      this.type = input.type
      this.lowerValue = input.lowerValue
      this.higherValue = input.higherValue
    }
    return this
  }

}
