'use strict'

let whatDocumentsPage, documentUploadPage
module.exports = {
  _init () {
    whatDocumentsPage = require('../../certificateOfService/pages/what-documents')
    documentUploadPage = require('../../certificateOfService/pages/document-upload')
  },
  open () {
    documentUploadPage.open()
  },
  uploadDocument () {
    whatDocumentsPage.open()
    whatDocumentsPage.selectFileUploadCheckBox()
    whatDocumentsPage.selectSaveAndContinueButton()
    documentUploadPage.selectParticularsOfClaimFile()
  }

}
