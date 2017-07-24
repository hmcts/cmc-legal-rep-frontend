/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import CompanyName, { ValidationErrors } from 'forms/models/companyName'
import * as randomstring from 'randomstring'

describe( 'CompanyName', () => {

  describe( 'constructor', () => {
    it( 'should set the primitive fields to undefined', () => {
      const companyName = new CompanyName()
      expect( companyName.name ).to.be.undefined
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

    it( 'should reject company name with undefined', () => {
      const errors = validator.validateSync( new CompanyName( undefined ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.COMPANY_NAME_REQUIRED )
    } )

    it( 'should reject company name with null type', () => {
      const errors = validator.validateSync( new CompanyName( null ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.COMPANY_NAME_REQUIRED )
    } )

    it( 'should reject company name with empty string', () => {
      const errors = validator.validateSync( new CompanyName( '' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.COMPANY_NAME_REQUIRED )
    } )

    it( 'should reject company name with white spaces string', () => {
      const errors = validator.validateSync( new CompanyName( '   ' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.COMPANY_NAME_REQUIRED )
    } )

    it( 'should reject company name with more than 255 characters', () => {
      const errors = validator.validateSync( new CompanyName( randomstring.generate( 256 ) ) )
      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.COMPANY_NAME_TOO_LONG )
    } )

    it( 'should accept company name with 255 characters', () => {
      const errors = validator.validateSync( new CompanyName( randomstring.generate( 255 ) ) )
      expect( errors.length ).to.equal( 0 )
    } )

    it( 'should accept valid company name', () => {
      const errors = validator.validateSync( new CompanyName( 'My Company Name Ltd.' ) )

      expect( errors.length ).to.equal( 0 )
    } )

  } )
} )
