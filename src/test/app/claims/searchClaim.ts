import { assert, expect } from 'chai'
import { SearchClaim } from 'claims/searchClaim'

function isError (e) {
  if (typeof e === 'string') {
    return Promise.reject(new Error(e))
  }
  return Promise.resolve(e)
}

describe('searchClaim', () => {

  describe('isClaimReferenceNumber', () => {
    it(`should return true when a valid claim reference is passed`, () => {
      const result: boolean = SearchClaim.isClaimReferenceNumber('000LR001')
      expect(result).to.be.equals(true)
    })

    it(`should return true when a valid lower case claim reference is passed`, () => {
      const result: boolean = SearchClaim.isClaimReferenceNumber('000lr999')
      expect(result).to.be.equals(true)
    })

    it(`should return false when a invalid claim reference is passed`, () => {
      const result: boolean = SearchClaim.isClaimReferenceNumber('abc12abc')
      expect(result).to.be.equals(false)
    })
  })

  describe('search', () => {
    it('should throw error when search text is undefined', () => {
      return SearchClaim.search(undefined, 'token')
        .then(() => {
          return Promise.reject('Search text cannot be blank')
        })
        .catch(isError)
        .then((err) => {
          assert.isDefined(err)
        })
    })

    it('should throw error when search text is null', () => {
      return SearchClaim.search(null, 'token')
        .then(() => {
          return Promise.reject('Search text cannot be blank')
        })
        .catch(isError)
        .then((err) => {
          assert.isDefined(err)
        })
    })

    it('should throw error when user auth token is undefined', () => {
      return SearchClaim.search('Re123', undefined)
        .then(() => {
          return Promise.reject('User auth token cannot be blank')
        })
        .catch(isError)
        .then((err) => {
          assert.isDefined(err)
        })
    })

    it('should throw error when user auth token is null', () => {
      return SearchClaim.search('Ref123', null)
        .then(() => {
          return Promise.reject('User auth token cannot be blank')
        })
        .catch(isError)
        .then((err) => {
          assert.isDefined(err)
        })
    })
  })
})
