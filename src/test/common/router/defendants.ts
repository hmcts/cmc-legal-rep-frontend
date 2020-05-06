import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as express from 'express'
import { Defendants } from 'shared/router/defendants'
import Defendant from 'drafts/models/defendant'
import { Paths as ClaimPaths } from 'claim/paths'

chai.use(spies)
const expect = chai.expect

function createDefendants (res: express.Response, defendantChangeIndex?: number) {
  res.locals.isLoggedIn = true
  res.locals.user = {
    id: 123
  }
  res.locals.legalClaimDraft = {
    document: {
      defendants: [],
      defendantChangeIndex: defendantChangeIndex
    }
  }
}

describe('Defendants', () => {
  it('should add defendant', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    Defendants.addDefendant(res)
    expect(res.locals.legalClaimDraft.document.defendants.length).eq(1)
  })

  it('should remove defendant from response defendants', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    res.locals.legalClaimDraft.document.defendants.push(new Defendant())
    res.locals.legalClaimDraft.document.defendants.push(new Defendant())

    Defendants.removeDefendant(res, '1')
    expect(res.locals.legalClaimDraft.document.defendants.length).eq(1)
  })

  it('should give current defendants index', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    res.locals.legalClaimDraft.document.defendants.push(new Defendant())
    res.locals.legalClaimDraft.document.defendants.push(new Defendant())
    res.locals.legalClaimDraft.document.defendants.push(new Defendant())

    expect(Defendants.getCurrentIndex(res)).eq(2)
  })

  describe('getChangeIndex', () => {

    it('should give defendants index from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '1' }
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getChangeIndex(req, res)).eq(0)
    })

    it('should throw error if index is negative number from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '-1' }
      const res: express.Response = mockRes()

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

    it('should throw error if index is out of range for the defendants array', async () => {
      const req: express.Request = mockReq()
      req.query = { index: '100' }
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

    it('should throw error if query parameter index is not present', async () => {
      const req: express.Request = mockReq()
      const res: express.Response = mockRes()

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

  })

  describe('getIndex', () => {
    it('should give change index from draft', async () => {
      const res: express.Response = mockRes()
      createDefendants(res, 1)

      expect(Defendants.getIndex(res)).eq(1)
    })

    it('should give last defendant index if not a change request', async () => {
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getIndex(res)).eq(0)
    })
  })

  describe('getPartyStrip', () => {
    it('for just one defendant', async () => {
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getPartyStrip(res)).eq('Defendant')
    })

    it('for more than one defendants', async () => {
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getPartyStrip(res)).eq('Defendant 2')
    })
  })

  describe('getPartyStripeTitleForRepresentative', () => {
    it('for just one defendant', async () => {
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getPartyStripeTitleForRepresentative(res)).eq('Defendant\'s legal representative')
    })

    it('for more than one defendants', async () => {
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())
      res.locals.legalClaimDraft.document.defendants.push(new Defendant())

      expect(Defendants.getPartyStripeTitleForRepresentative(res)).eq('Defendant 2\'s legal representative')
    })
  })

  describe('getNextPage', () => {
    it('should give defendant address page', async () => {
      const req: express.Request = mockReq()
      req.query = { page: 'address' }
      expect(Defendants.getNextPage(req)).eq(ClaimPaths.defendantAddressPage.uri)
    })

    it('should give defendant represented page', async () => {
      const req: express.Request = mockReq()
      req.query = { page: 'represented' }
      expect(Defendants.getNextPage(req)).eq(ClaimPaths.defendantRepresentedPage.uri)
    })

    it('should give defendant reps address page', async () => {
      const req: express.Request = mockReq()
      req.query = { page: 'reps-address' }
      expect(Defendants.getNextPage(req)).eq(ClaimPaths.defendantRepAddressPage.uri)
    })

    it('should give defendant service address page', async () => {
      const req: express.Request = mockReq()
      req.query = { page: 'service-address' }
      expect(Defendants.getNextPage(req)).eq(ClaimPaths.defendantServiceAddressPage.uri)
    })

    it('should give defendant type page if no query parameter', async () => {
      const req: express.Request = mockReq()
      expect(Defendants.getNextPage(req)).eq(ClaimPaths.defendantTypePage.uri)
    })
  })
})
