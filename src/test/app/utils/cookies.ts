import { expect } from 'chai'
import { Cookie } from 'forms/models/cookie'
import { RepresentativeDetails } from 'forms/models/representativeDetails'
import { OrganisationName } from 'forms/models/organisationName'
import { FeeAccount } from 'forms/models/feeAccount'
import { Address } from 'claims/models/address'
import { ContactDetails } from 'forms/models/contactDetails'

const firstCompany: RepresentativeDetails = new RepresentativeDetails('1',
  new OrganisationName('First Company'),
  new Address('123 FAKE ROAD', '', 'LONDON', 'SW21AN'),
  new ContactDetails('07777777777', 'me@server.net', 'DX1234567'),
  new FeeAccount('PBA1234567'))
const firstCompanyUpdated: RepresentativeDetails = new RepresentativeDetails('1',
  new OrganisationName('First Company'),
  new Address('123 FAKE ROAD', '', 'LONDON', 'SW21AN'),
  new ContactDetails('07777777777', 'me@server.net', 'DX1234567'),
  new FeeAccount('PBA1234567'))
const secondCompany: RepresentativeDetails = new RepresentativeDetails('2',
  new OrganisationName('Second Company'),
  new Address('123 FAKE STREET', '', 'LONDON', 'SW21AN'),
  new ContactDetails('07777777777', 'me@server.net', 'DX1234567'),
  new FeeAccount('PBA1234567'))
const thirdCompany: RepresentativeDetails = new RepresentativeDetails('3',
  new OrganisationName('Third Company'),
  new Address('123 FAKE STREET', '', 'LONDON', 'SW21AN'),
  new ContactDetails('07777777777', 'me@server.net', 'DX1234567'),
  new FeeAccount('PBA1234567'))
const representativeDetails: RepresentativeDetails[] = [firstCompany, secondCompany]
const representativeDetailsUpdated: RepresentativeDetails[] = [secondCompany, firstCompanyUpdated]
const representativeDetailsThreeCompanies: RepresentativeDetails[] = [firstCompanyUpdated, secondCompany, thirdCompany]

describe('Cookie', () => {
  describe('getCookie', () => {
    it('should return a RepresentativeDetails object when undefined is passed in', () => {
      expect(Cookie.getCookie(undefined, '1')).to.deep.eq(new RepresentativeDetails())
    })

    it('should return the users RepresentativeDetails object from an array that is passed in', () => {
      expect(Cookie.getCookie(representativeDetails, '1')).to.deep.eq(firstCompany)
    })

    it('should return a RepresentativeDetails object if the user does not have an entry in the array', () => {
      expect(Cookie.getCookie(representativeDetails, '3')).to.deep.eq(new RepresentativeDetails())
    })
  })

  describe('saveCookie', () => {
    it('should return an empty RepresentativeDetails array when undefined is passed in', () => {
      expect(Cookie.saveCookie(undefined, '1', undefined)).to.deep.eq([])
    })

    it('should return a RepresentativeDetails array with the updated RepresentativeDetail if the user already has a saved cookie', () => {
      expect(Cookie.saveCookie(representativeDetails, '1', firstCompanyUpdated)).to.deep.eq(representativeDetailsUpdated)
    })

    it('should return a RepresentativeDetails array with the RepresentativeDetail added if the user already does not have a saved cookie', () => {
      expect(Cookie.saveCookie(representativeDetails, '3', thirdCompany)).to.deep.eq(representativeDetailsThreeCompanies)
    })
  })
})
