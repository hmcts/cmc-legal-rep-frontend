import * as mock from 'mock-require'
import DraftClaim from 'drafts/models/draftClaim'
import Claim from 'claims/models/claim'
import ClaimData from 'claims/models/claimData'

import Claimant from 'drafts/models/claimant'

import ServiceAuthToken from 'app/idam/serviceAuthToken'

import moment = require('moment')
import Representative from 'drafts/models/representative'
import Defendant from 'drafts/models/defendant'

function mockedDraftClaim () {
  let draft = new DraftClaim()
  draft.claimant = new Claimant()
  draft.representative = new Representative()
  draft.defendant = new Defendant()
  return draft
}

function mockedClaim () {
  let claim = new Claim()
  claim.claimData = new ClaimData()
  claim.claimData.claimant = new Claimant()
  claim.claimNumber = 'NNDD-NNDD'
  claim.externalId = 'uuid'
  claim.responseDeadline = moment()
  claim.createdAt = moment()
  return claim
}

function mockUser () {
  return { id: 123, roles: ['citizen', 'letter-holder'] }
}

mock('idam/authorizationMiddleware', {
  AuthorizationMiddleware: {
    requestHandler: () => {
      return (req, res, next) => {
        res.locals.user = mockUser()
        next()
      }
    }
  }
})

mock('claim/draft/claimDraftMiddleware', {
  'ClaimDraftMiddleware': {
    retrieve: (req, res, next) => {
      res.locals.user = {
        claimDraft: mockedDraftClaim()
      }
      next()
    }
  }
})

mock('claims/retrieveClaimMiddleware', {
  'default': (req, res, next) => {
    res.locals.user = {
      claim: mockedClaim()
    }
    next()
  }
})

mock('idam/idamClient', {
  'default': {
    retrieveUserFor: (jwtToken) => mockUser(),
    retrieveServiceToken: () => Promise.resolve(new ServiceAuthToken('token'))
  }
})

mock('claims/claimStoreClient', {
  'default': {
    retrieve: (userId) => mockedClaim(),
    retrieveByClaimantId: (claimantId) => [mockedClaim()],
    retrieveByLetterHolderId: (letterHolderId) => mockedClaim(),
    retrieveByDefendantId: (defendantId) => mockedClaim(),
    retrieveByExternalId: (externalId) => mockedClaim()
  }
})

mock('fees/feesClient', {
  'default': {
    calculateIssueFee: (amount) => Promise.resolve(100),
    calculateHearingFee: (amount) => Promise.resolve(50)
  }
})

mock('response/guards/alreadyRespondedGuard', {
  AlreadyRespondedGuard: {
    requestHandler: (req, res, next) => {
      next()
    }
  }
})
