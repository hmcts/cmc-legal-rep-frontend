declare namespace CodeceptJS {
  export interface I {
    createCitizenUser: () => string
    createSolicitorUser: () => Promise<string>
    createClaim: (claimData: ClaimData, submitterEmail: string) => string
    linkDefendantToClaim: (referenceNumber: string, ownerEmail: string, defendantEmail: string) => void
    respondToClaim: (referenceNumber: string, ownerEmail: string, responseData: ResponseData, defendantEmail: string) => void

    amOnLegalAppPage: (path: string) => void
    downloadPDF: (pdfUrl: string, sessionCookie: string) => Promise<void>
    attachFile: (locator: string, path: string) => any
    grabAttributeFrom: (locator: string, attr: string) => any

    fillField: (locator: string, value: string) => any
    selectOption: (select: string, option: string) => any
  }
}

type CodeceptJSHelper = {
  _before: () => void;
  _after: () => void;
}

declare const codecept_helper: { new(): CodeceptJSHelper }
