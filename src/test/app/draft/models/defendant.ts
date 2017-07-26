import { expect } from 'chai'

import Defendant from 'drafts/models/defendant'
import { Address } from 'forms/models/address'
import Representative from 'drafts/models/representative'

describe( 'Defendant', () => {
  describe( 'constructor', () => {
    it( 'should have instance fields initialised', () => {
      let defendant = new Defendant()
      expect( defendant.address ).to.be.instanceof( Address )
      expect( defendant.representative ).to.be.instanceof( Representative )
    } )
  } )

  describe( 'deserialize', () => {
    it( 'should return a Defendant instance initialised with defaults for undefined', () => {
      expect( new Defendant().deserialize( undefined ) ).to.eql( new Defendant() )
    } )

    it( 'should return a Defendant instance initialised with defaults for null', () => {
      expect( new Defendant().deserialize( null ) ).to.eql( new Defendant() )
    } )
  } )
} )
