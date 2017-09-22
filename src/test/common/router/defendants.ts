import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'
import * as express from 'express'
import { Defendants } from 'common/router/defendants'
import Defendant from 'app/drafts/models/defendant'

chai.use(spies)
const expect = chai.expect

function createDefendants (res: express.Response) {
  res.locals.isLoggedIn = true
  res.locals.user = {
    id: 123
  }
  res.locals.user.legalClaimDraft = {
    defendants: []
  }
}

describe('Defendants', () => {
  it('should add defendant', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    Defendants.addDefendant(res)
    expect(res.locals.user.legalClaimDraft.defendants.length === 1)

  })

  it('should remove defendant from response defendants', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    res.locals.user.legalClaimDraft.defendants.push(new Defendant())
    res.locals.user.legalClaimDraft.defendants.push(new Defendant())

    Defendants.removeDefendant(res, '1')
    expect(res.locals.user.legalClaimDraft.defendants.length === 1)

  })

  it('should give current defendants index', async () => {
    const res: express.Response = mockRes()
    createDefendants(res)
    res.locals.user.legalClaimDraft.defendants.push(new Defendant())
    res.locals.user.legalClaimDraft.defendants.push(new Defendant())
    res.locals.user.legalClaimDraft.defendants.push(new Defendant())

    expect(Defendants.getCurrentIndex(res) === 2)

  })

  describe('getChangeIndex', () => {

    it('should give defendants index from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: 1 }
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.user.legalClaimDraft.defendants.push(new Defendant())

      expect(Defendants.getChangeIndex(req, res) === 0)

    })

    it('should throw error if index is negative number from query parameter', async () => {
      const req: express.Request = mockReq()
      req.query = { index: -1 }
      const res: express.Response = mockRes()

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

    it('should throw error if index is out of range for the defendants array', async () => {
      const req: express.Request = mockReq()
      req.query = { index: 100 }
      const res: express.Response = mockRes()
      createDefendants(res)
      res.locals.user.legalClaimDraft.defendants.push(new Defendant())

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

    it('should throw error if query parameter index is not present', async () => {
      const req: express.Request = mockReq()
      const res: express.Response = mockRes()

      expect(() => Defendants.getChangeIndex(req, res)).to.throw(Error, 'Invalid index for defendant')
    })

  })
})
