import Name from 'app/forms/models/name'

export default class Claimant {
  name: Name = new Name()

  deserialize (input: any): Claimant {
    if (input) {
      this.name = new Name().deserialize(input.name)
    }
    return this
  }
}
