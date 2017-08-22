import * as chai from 'chai'
import * as spies from 'sinon-chai'
import { mockRes } from 'sinon-express-mock'
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
})
