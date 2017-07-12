import isUnprotectedPath from 'idam/routeHelper'
import { expect } from 'chai'

describe('Checking that path is unprotected', () => {
  it('should return true for receiver route', (done) => {
    expect(isUnprotectedPath('/receiver')).to.equal(true)
    done()
  })
  it('should return true for version page', (done) => {
    expect(isUnprotectedPath('/version')).to.equal(true)
    done()
  })
  it('should return true for health page', (done) => {
    expect(isUnprotectedPath('/health')).to.equal(true)
    done()
  })
})

describe('Checking that path is protected', () => {
  it('should return true for index page', (done) => {
    expect(isUnprotectedPath('/')).to.equal(false)
    done()
  })
  it('should return true for login page', (done) => {
    expect(isUnprotectedPath('/login')).to.equal(false)
    done()
  })
  it('should return false for any other page', (done) => {
    expect(isUnprotectedPath('/sdfsdfs')).to.equal(false)
    done()
  })
})
