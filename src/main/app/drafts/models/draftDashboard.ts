import { Serializable } from 'app/models/serializable'
import { Search } from 'forms/models/search'

export class DraftDashboard implements Serializable<DraftDashboard> {
  search: Search = new Search()

  deserialize (input: any): DraftDashboard {
    if (input) {
      this.search = input.search
    }

    return this
  }
}
