import { expect } from 'chai'

import Defendant from 'drafts/models/defendant'
import { Address } from 'forms/models/address'
import Representative from 'drafts/models/representative'
import { DefendantDetails } from 'forms/models/defendantDetails'
import { DefendantRepresented } from 'app/forms/models/defendantRepresented'
import { ContactDetails } from 'app/forms/models/contactDetails'
import CompanyName from 'app/forms/models/companyName'
import { PartyTypes } from 'app/forms/models/partyTypes'
import { YesNo } from 'app/forms/models/yesNo'

describe('Defendant', () => {
  describe('constructor', () => {
    it('should have instance fields initialised', () => {
      let defendant = new Defendant()
      expect(defendant.address).to.be.instanceof(Address)
      expect(defendant.representative).to.be.instanceof(Representative)
      expect(defendant.defendantDetails).to.be.instanceof(DefendantDetails)
      expect(defendant.defendantRepresented).to.be.instanceof(DefendantRepresented)
    })
  })

  describe('deserialize', () => {
    it('should return a Defendant instance initialised with defaults for undefined', () => {
      expect(new Defendant().deserialize(undefined)).to.eql(new Defendant())
    })

    it('should return a Defendant instance initialised with defaults for null', () => {
      expect(new Defendant().deserialize(null)).to.eql(new Defendant())
    })

    it('should return an instance from given object', () => {
      const contactDetails = new ContactDetails('07555055505', 'email@example.com', 'any dx address')
      const companyName = new CompanyName('companyName')
      const address = new Address('line1', 'line2', 'city', 'postcode')
      const representative = new Representative(companyName, address, contactDetails)
      const defendantDetails = new DefendantDetails(PartyTypes.INDIVIDUAL, 'title', 'full name')
      const defendantRepresented = new DefendantRepresented(YesNo.YES, companyName.name)

      const defendant = new Defendant().deserialize({
        address: { line1: 'line1', line2: 'line2', city: 'city', postcode: 'postcode' },
        representative: {
          companyName: { name: 'companyName' },
          address: { line1: 'line1', line2: 'line2', city: 'city', postcode: 'postcode' },
          contactDetails: { phoneNumber: '07555055505', email: 'email@example.com', dxAddress: 'any dx address' }
        },
        defendantDetails: {
          type: { value: 'INDIVIDUAL', displayValue: 'An individual' },
          title: 'title',
          fullName: 'full name',
          organisation: undefined,
          companyHouseNumber: undefined
        },
        defendantRepresented: {
          isDefendantRepresented: { value: 'YES', displayValue: 'yes' },
          companyName: companyName.name
        }
      })

      expect(defendant.address).to.deep.eq(address)
      expect(defendant.representative).to.deep.eq(representative)
      expect(defendant.defendantDetails).to.deep.eq(defendantDetails)
      expect(defendant.defendantRepresented).to.deep.eq(defendantRepresented)
    })
  })
})
