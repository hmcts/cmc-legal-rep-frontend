/* tslint:disable:no-unused-expression */

import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { Paths as ClaimPaths } from 'claim/paths'
import { RoutablePath } from 'shared/router/routablePath'

chai.use(spies)
const expect = chai.expect

describe('RoutablePath', () => {
  it('should add external id in uri', async () => {
    const externalId = '12321343345'
    const uri = ClaimPaths.claimSubmittedPage.evaluateUri({ externalId: externalId })
    expect(uri === `'/legal/claim/${externalId}/submitted'`)

  })

  it('should throw when external id not defined', async () => {
    try {
      ClaimPaths.claimSubmittedPage.evaluateUri(undefined)
    } catch (err) {
      expect(err.message).to.eql('Path parameter substitutions are required')
    }
  })

  it('should throw when external parameter is empty', async () => {
    try {
      ClaimPaths.claimSubmittedPage.evaluateUri({})
    } catch (err) {
      expect(err.message).to.eql('Path parameter substitutions are required')
    }
  })

  it('should throw when external parameter key is different', async () => {
    try {
      const externalId = '12321343345'
      ClaimPaths.claimSubmittedPage.evaluateUri({ unKnownKey: externalId })
    } catch (err) {
      expect(err.message).to.eql('Path parameter :unKnownKey is not defined')
    }
  })

  it('should throw when uri does not have parameter', async () => {
    try {
      const externalId = '12321343345'
      new RoutablePath('/legal/claim/:externalId/:missingParam').evaluateUri({ externalId: externalId })
    } catch (err) {
      expect(err.message).to.eql('Path parameter substitutions for :missingParam are missing')
    }
  })
})
