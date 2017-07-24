/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import { expect } from 'chai'
import { Validator } from 'class-validator'
import { expectValidationError } from './validationUtils'
import Representative, { ValidationErrors } from 'forms/models/representative'
import * as randomstring from 'randomstring'

describe( 'Representative', () => {

  describe( 'constructor', () => {
    it( 'should set the primitive fields to undefined', () => {
      const representative = new Representative()
      expect( representative.name ).to.be.undefined
    } )
  } )

  describe( 'deserialize', () => {
    it( 'should return an instance initialised with defaults for undefined', () => {
      expect( new Representative().deserialize( undefined ) ).to.eql( new Representative() )
    } )

    it( 'should return an instance initialised with defaults for null', () => {
      expect( new Representative().deserialize( null ) ).to.eql( new Representative() )
    } )

    it( 'should return an instance from given object', () => {
      const name = 'My Company Name'
      const result = new Representative().deserialize( {
        name: name
      } )
      expect( result.name ).to.be.equals( name )
    } )
  } )

  describe( 'validation', () => {
    const validator: Validator = new Validator()

    it( 'should reject representative name with undefined', () => {
      const errors = validator.validateSync( new Representative( undefined ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.REPRESENTATIVE_NAME_REQUIRED )
    } )

    it( 'should reject representative name with null type', () => {
      const errors = validator.validateSync( new Representative( null ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.REPRESENTATIVE_NAME_REQUIRED )
    } )

    it( 'should reject representative name with empty string', () => {
      const errors = validator.validateSync( new Representative( '' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.REPRESENTATIVE_NAME_REQUIRED )
    } )

    it( 'should reject representative name with white spaces string', () => {
      const errors = validator.validateSync( new Representative( '   ' ) )

      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.REPRESENTATIVE_NAME_REQUIRED )
    } )

    it( 'should reject representative name with more than 255 characters', () => {
      const errors = validator.validateSync( new Representative( randomstring.generate( 256 ) ) )
      expect( errors.length ).to.equal( 1 )
      expectValidationError( errors, ValidationErrors.REPRESENTATIVE_NAME_TOO_LONG )
    } )

    it( 'should accept representative name with 255 characters', () => {
      const errors = validator.validateSync( new Representative( randomstring.generate( 255 ) ) )
      expect( errors.length ).to.equal( 0 )
    } )

    it( 'should accept valid representative name', () => {
      const errors = validator.validateSync( new Representative( 'My Company Name Ltd.' ) )

      expect( errors.length ).to.equal( 0 )
    } )

  } )
} )
