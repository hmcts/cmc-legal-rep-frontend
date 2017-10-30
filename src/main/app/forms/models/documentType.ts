import { MaxLength, ValidateIf } from 'class-validator'
import { Serializable } from 'models/serializable'

export class ValidationErrors {
  static readonly OTHER_DOCUMENTS_TOO_LONG: string = 'You’ve entered too many characters'
}

export class DocumentType implements Serializable<DocumentType> {

  particularsOfClaim?: boolean
  responsePack?: boolean
  scheduleOfLoss?: boolean
  medicalReport?: boolean
  other?: boolean

  @ValidateIf(o => o.other === true)
  @MaxLength( 255, { message: ValidationErrors.OTHER_DOCUMENTS_TOO_LONG } )
  otherDocuments?: string

  constructor (particularsOfClaim?: boolean, responsePack?: boolean,
               scheduleOfLoss?: boolean, medicalReport?: boolean, other?: boolean, otherDocuments?: string) {
    this.particularsOfClaim = particularsOfClaim
    this.responsePack = responsePack
    this.scheduleOfLoss = scheduleOfLoss
    this.medicalReport = medicalReport
    this.other = other
    this.otherDocuments = otherDocuments
  }

  static fromObject (value?: any): DocumentType {
    if (value != null) {
      return new DocumentType(value.particularsOfClaim, value.responsePack, value.scheduleOfLoss,
                              value.medicalReport, value.other, value.otherDocuments)
    }

    return new DocumentType()
  }

  deserialize (input: any): DocumentType {
    if (input) {
      this.particularsOfClaim = input.particularsOfClaim
      this.responsePack = input.responsePack
      this.scheduleOfLoss = input.scheduleOfLoss
      this.medicalReport = input.medicalReport
      this.other = input.other
      this.otherDocuments = input.otherDocuments
    }
    return this
  }
}
