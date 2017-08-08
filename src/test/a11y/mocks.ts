import * as mock from 'mock-require'
import DraftLegalClaim from 'drafts/models/draftLegalClaim'
import Claim from 'claims/models/claim'
import ClaimData from 'claims/models/claimData'

import Claimant from 'drafts/models/claimant'

import ServiceAuthToken from 'app/idam/serviceAuthToken'
import Representative from 'drafts/models/representative'
import Defendant from 'drafts/models/defendant'
import { ClaimantDetails } from 'app/forms/models/claimantDetails'
import { DefendantDetails } from 'app/forms/models/defendantDetails'
import { PartyTypes } from 'app/forms/models/partyTypes'
import moment = require('moment')
import CompanyName from 'app/forms/models/companyName'

function mockedDraftClaim () {
  let draft = new DraftLegalClaim()
  draft.claimant = new Claimant()
  draft.claimant.claimantDetails = new ClaimantDetails()
  draft.claimant.claimantDetails.type = PartyTypes.INDIVIDUAL
  draft.representative = new Representative()
  draft.representative.companyName = new CompanyName('name')
  draft.defendants = [new Defendant()]
  draft.defendants[0].defendantDetails = new DefendantDetails()
  draft.defendants[0].defendantDetails.type = PartyTypes.INDIVIDUAL
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
        legalClaimDraft: mockedDraftClaim()
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
