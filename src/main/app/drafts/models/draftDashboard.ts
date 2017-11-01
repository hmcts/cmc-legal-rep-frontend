import { Serializable } from 'app/models/serializable'
import { Search } from 'forms/search'

export class DraftDashboard implements Serializable<DraftDashboard> {
  search: Search

  deserialize (input: any): DraftDashboard {
    if (input) {
      this.search = input.search
    }

    return this
  }
}
