import { Serializable } from 'app/models/serializable'

export default class DraftView implements Serializable<DraftView> {
  viewFlowOption: boolean = false

  deserialize (input: any): DraftView {
    if (input) {
      this.viewFlowOption = input.viewFlowOption
    }

    return this
  }
}
