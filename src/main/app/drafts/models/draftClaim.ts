import { Serializable } from 'models/serializable'

export default class DraftClaim implements Serializable<DraftClaim> {
  helloWorld: string

  deserialize (input: any): DraftClaim {
    if (input) {
      this.helloWorld = input.helloWorld
    }
    return this
  }
}
