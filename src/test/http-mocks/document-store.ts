import * as config from 'config'
import * as mock from 'nock'

import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = `${config.get('documentManagement.url')}`
const document = {
  'size': 72552,
  'mimeType': 'application/pdf',
  'originalDocumentName': '000LR012.pdf',
  'createdBy': '15',
  'lastModifiedBy': '15',
  'modifiedOn': '2017-11-01T10:23:55.120+0000',
  'createdOn': '2017-11-01T10:23:55.271+0000',
  'classification': 'RESTRICTED',
  'roles': null,
  '_links': {
    'self': {
      'href': 'http://localhost:8085/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4'
    },
    'binary': {
      'href': 'http://localhost:8085/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4/binary'
    }
  },
  '_embedded': {
    'allDocumentVersions': {
      '_embedded': {
        'documentVersions': [
          {
            'size': 72552,
            'mimeType': 'application/pdf',
            'originalDocumentName': '000LR002.pdf',
            'createdBy': '15',
            'createdOn': '2017-11-01T10:23:55.271+0000',
            '_links': {
              'document': {
                'href': 'http://localhost:8085/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4'
              },
              'self': {
                'href': 'http://localhost:8085/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4/versions/bd3b0ecc-714a-46c0-9db7-275c42986af5'
              },
              'binary': {
                'href': 'http://localhost:8085/documents/85d97996-22a5-40d7-882e-3a382c8ae1b4/versions/bd3b0ecc-714a-46c0-9db7-275c42986af5/binary'
              }
            }
          }
        ]
      }
    }
  }
}

const sampleDocumentObj = {
  '_embedded': {
    'documents': [document]
  }
}

export function resolveFindMetaData (): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/documents.*'))
    .reply(HttpStatus.OK, document)
}

export function resolveGetDocument (): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/documents.*'))
    .reply(HttpStatus.OK, [])
}

export function rejectGetDocument (reason: string = 'HTTP Error'): mock.Scope {
  return mock(serviceBaseURL)
    .get(new RegExp('/documents/*/binary'))
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}

export function resolveSave () {
  return mock(serviceBaseURL)
    .post(`/documents`)
    .reply(HttpStatus.OK, { ...sampleDocumentObj })
}

export function rejectSave (id: number = 100, reason: string = 'HTTP error') {
  return mock(serviceBaseURL)
    .put(`/documents/`)
    .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason)
}
