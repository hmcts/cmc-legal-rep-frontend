/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import CompanyName, { ValidationErrors } from 'forms/models/organisationName'
import * as randomstring from 'randomstring'

describe( 'OrganisationName', () => {

  describe( 'constructor', () => {
    it( 'should set the primitive fields to undefined', () => {
      const organisationName = new CompanyName()
      expect( organisationName.name ).to.be.undefined
    } )
  } )

  describe( 'deserialize', () => {
    it( 'should return an instance initialised with defaults for undefined', () => {
      expect( new CompanyName().deserialize( undefined ) ).to.eql( new CompanyName() )
    } )

    it( 'should return an instance initialised with defaults for null', () => {
      expect( new CompanyName().deserialize( null ) ).to.eql( new CompanyName() )
    } )

    it( 'should return an instance from given object', () => {
      const name = 'My Company Name'
      const result = new CompanyName().deserialize( {
        name: name
      } )
      expect( result.name ).to.be.equals( name )
    } )
  } )

  describe( 'validation', () => {
    const validator: Validator = new Validator()

    it( 'should reject organisation name with undefined', () => {
      const errors = validator.validateSync( new CompanyName( undefined ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.ORGANISATION_NAME_REQUIRED )
    } )

    it( 'should reject organisation name with null type', () => {
      const errors = validator.validateSync( new CompanyName( null ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.ORGANISATION_NAME_REQUIRED )
    } )

    it( 'should reject organisation name with empty string', () => {
      const errors = validator.validateSync( new CompanyName( '' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.ORGANISATION_NAME_REQUIRED )
    } )

    it( 'should reject organisation name with white spaces string', () => {
      const errors = validator.validateSync( new CompanyName( '   ' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.ORGANISATION_NAME_REQUIRED )
    } )

    it( 'should reject organisation name with more than 255 characters', () => {
      const errors = validator.validateSync( new CompanyName( randomstring.generate( 256 ) ) )
      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.ORGANISATION_NAME_TOO_LONG )
    } )

    it( 'should accept organisation name with 255 characters', () => {
      const errors = validator.validateSync( new CompanyName( randomstring.generate( 255 ) ) )
      expect( errors.length ).to.equal( 0 )
    } )

    it( 'should accept valid organisation name', () => {
      const errors = validator.validateSync( new CompanyName( 'My Organisation Name Ltd.' ) )

      expect( errors.length ).to.equal( 0 )
    } )

  } )
} )
