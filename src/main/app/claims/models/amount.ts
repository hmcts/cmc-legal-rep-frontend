import { Serializable } from 'models/serializable'

export class Amount implements Serializable<Amount> {

  cannotState?: string
  lowerValue?: number
  higherValue?: number
  type?: string

  deserialize (input?: any): Amount {
    if (input) {
      this.lowerValue = input.lowerValue
      this.higherValue = input.higherValue
      this.cannotState = input.cannotState
      if (this.higherValue) {
        this.type = 'range'
      } else {
        this.type = 'not_known'
      }
    }

    return this
  }
}
