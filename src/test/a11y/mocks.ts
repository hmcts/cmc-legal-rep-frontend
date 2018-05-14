import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreMock from 'test/http-mocks/draft-store'
import * as claimStoreMock from 'test/http-mocks/claim-store'
import * as feesMock from 'test/http-mocks/fees'

idamServiceMock.resolveRetrieveUserFor('1', 'solicitor').persist()
idamServiceMock.resolveRetrieveServiceToken().persist()

draftStoreMock.resolveFindAllDrafts().persist()

claimStoreMock.resolveRetrieveClaimByExternalId({
  respondedAt: '2017-08-07T15:27:34.654',
  countyCourtJudgmentRequestedAt: '2017-08-09T11:51:28.144'
}).persist()

feesMock.resolveCalculateIssueFee().persist()
