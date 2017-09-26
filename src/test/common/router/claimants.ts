import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { mockRes } from 'sinon-express-mock'
import * as express from 'express'
import { Claimants } from 'common/router/claimants'
import Claimant from 'drafts/models/claimant'

chai.use(spies)
const expect = chai.expect

function createClaimants (res: express.Response) {
  res.locals.isLoggedIn = true
  res.locals.user = {
    id: 123
  }
  res.locals.user.legalClaimDraft = {
    claimants: []
  }
}

describe('Claimants', () => {
  it('should add claimant', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    Claimants.addClaimant(res)
    expect(res.locals.user.legalClaimDraft.claimants.length === 1)

  })

  it('should remove claimant from response defendants', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    res.locals.user.legalClaimDraft.claimants.push(new Claimant())
    res.locals.user.legalClaimDraft.claimants.push(new Claimant())

    Claimants.removeClaimant(res, '1')
    expect(res.locals.user.legalClaimDraft.claimants.length === 1)

  })

  it('should give current claimants index', async () => {
    const res: express.Response = mockRes()
    createClaimants(res)
    res.locals.user.legalClaimDraft.claimants.push(new Claimant())
    res.locals.user.legalClaimDraft.claimants.push(new Claimant())
    res.locals.user.legalClaimDraft.claimants.push(new Claimant())

    expect(Claimants.getCurrentIndex(res) === 2)

  })
})
