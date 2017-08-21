import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'
import * as mock from 'nock'

import '../../../routes/expectations'
import { checkAuthorizationGuards } from './checks/authorization-check'
import * as feesServiceMock from '../../../http-mocks/fees'
import { Paths as ClaimPaths } from 'claim/paths'

import { app } from '../../../../main/app'

import * as idamServiceMock from '../../../http-mocks/idam'
import * as draftStoreServiceMock from '../../../http-mocks/draft-store'

const cookieName: string = config.get<string>('session.cookieName')
const pageHeading = 'Check the claim details'
const draftType: string = 'legalClaim'

describe('Claim : Details summary page', () => {
  beforeEach(() => {
    mock.cleanAll()
    draftStoreServiceMock.resolveRetrieve('legalClaim')
  })

  describe('on GET', () => {
    checkAuthorizationGuards(app, 'get', ClaimPaths.detailsSummaryPage.uri)

    describe('for authorized user', () => {
      beforeEach(() => {
        idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      })

      it('should return 500 and render error page when cannot calculate issue fee', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.rejectCalculateIssueFee('HTTP error')

        await request(app)
          .get(ClaimPaths.detailsSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.serverError.withText('Error'))
      })

      it('should render page when everything is fine', async () => {
        draftStoreServiceMock.resolveRetrieve(draftType)
        feesServiceMock.resolveCalculateIssueFee()

        await request(app)
          .get(ClaimPaths.detailsSummaryPage.uri)
          .set('Cookie', `${cookieName}=ABC`)
          .expect(res => expect(res).to.be.successful.withText(pageHeading))
      })

    })
  })

  describe('on POST', () => {
    checkAuthorizationGuards(app, 'post', ClaimPaths.detailsSummaryPage.uri)

    it('should redirect to statement of truth page when form is valid and everything is fine', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'cmc-private-beta', 'claimant')
      draftStoreServiceMock.resolveSave(draftType)
      feesServiceMock.resolveCalculateIssueFee()

      await request(app)
        .post(ClaimPaths.detailsSummaryPage.uri)
        .set('Cookie', `${cookieName}=ABC`)
        .expect(res => expect(res).to.be.redirect.toLocation(ClaimPaths.statementOfTruthPage.uri))
    })
  })
})
