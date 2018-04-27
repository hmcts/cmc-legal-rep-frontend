import { Serializable } from 'models/serializable'
import { Search } from 'forms/models/search'
import { DraftDocument } from '@hmcts/cmc-draft-store-middleware'

export class DraftDashboard extends DraftDocument implements Serializable<DraftDashboard> {
  search: Search = new Search()

  deserialize (input: any): DraftDashboard {
    if (input) {
      this.search = input.search
    }

    return this
  }
}
