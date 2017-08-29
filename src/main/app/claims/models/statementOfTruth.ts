import { Serializable } from 'models/serializable'

export class StatementOfTruth implements Serializable<StatementOfTruth> {

  signerName: string
  signerRole?: string

  deserialize (input?: any): StatementOfTruth {
    if (input) {
      this.signerName = input.signerName
      this.signerRole = input.signerRole
    }
    return this
  }

}
