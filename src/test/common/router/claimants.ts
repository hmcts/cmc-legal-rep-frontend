import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as express from 'express'
import { Claimants } from 'shared/router/claimants'
import Claimant from 'drafts/models/claimant'
import { Paths as ClaimPaths } from 'claim/paths'

chai.use(spies)
const expect = chai.expect

function createClaimants (res: express.Response, claimantChangeIndex?: number) {
  res.locals.isLoggedIn = true
  res.locals.user = {
    id: 123
  }
  res.locals.legalClaimDraft = {
    document: {
      claimants: [],
      claimantChangeIndex: claimantChangeIndex
    }
  }
}

describe('Claimants', () => {

  it('should add claimant', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    Claimants.addClaimant(res)
    expect(res.locals.legalClaimDraft.document.claimants.length === 1)

  })

  it('should remove claimant from response claimants', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    res.locals.legalClaimDraft.document.claimants.push(new Claimant())
    res.locals.legalClaimDraft.document.claimants.push(new Claimant())

    Claimants.removeClaimant(res, '1')
    expect(res.locals.legalClaimDraft.document.claimants.length === 1)

  })

  it('should give current claimants index', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    res.locals.legalClaimDraft.document.claimants.push(new Claimant())
    res.locals.legalClaimDraft.document.claimants.push(new Claimant())
    res.locals.legalClaimDraft.document.claimants.push(new Claimant())

    expect(Claimants.getCurrentIndex(res) === 2)

  })

  describe('getChangeIndex', () => {

    it('should give claimant index from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '1' }
      const res: express.Response = mockRes()
      createClaimants(res)
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())

      expect(Claimants.getChangeIndex(req, res)).eq(0)
    })

    it('should throw error if index is negative number from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '-1' }
      const res: express.Response = mockRes()

      expect(() => Claimants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for claimant')
    })

    it('should throw error if index is out of range for the claimants array', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '100' }
      const res: express.Response = mockRes()
      createClaimants(res)
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())

      expect(() => Claimants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for claimant')
    })

    it('should throw error if query parameter index is not present', async () => {
      const req: express.Request = mockReq()
      const res: express.Response = mockRes()

      expect(() => Claimants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for claimant')
    })

  })

  describe('getIndex', () => {
    it('should give change index from draft', async () => {
      const res: express.Response = mockRes()
      createClaimants(res, 1)

      expect(Claimants.getIndex(res)).eq(1)
    })

    it('should give last claimant index if not a change request', async () => {
      const res: express.Response = mockRes()
      createClaimants(res)
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())

      expect(Claimants.getIndex(res)).eq(0)
    })
  })

  describe('getPartyStrip', () => {
    it('for just one claimant', async () => {
      const res: express.Response = mockRes()
      createClaimants(res)
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())

      expect(Claimants.getPartyStrip(res)).eq('Claimant')
    })

    it('for more than one claimants', async () => {
      const res: express.Response = mockRes()
      createClaimants(res)
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())
      res.locals.legalClaimDraft.document.claimants.push(new Claimant())

      expect(Claimants.getPartyStrip(res)).eq('Claimant 2')
    })
  })

  describe('getNextPage', () => {
    it('should give claimant address page', async () => {
      const req: express.Request = mockReq()
      req.query = { page: 'address' }
      expect(Claimants.getNextPage(req)).eq(ClaimPaths.claimantAddressPage.uri)
    })

    it('should give claimant type page if no query parameter', async () => {
      const req: express.Request = mockReq()
      expect(Claimants.getNextPage(req)).eq(ClaimPaths.claimantTypePage.uri)
    })
  })
})
