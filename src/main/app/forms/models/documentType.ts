export class DocumentType {
  static readonly PARTICULARS_OF_CLAIM = new DocumentType('PARTICULARS_OF_CLAIM', 'Particulars of claim', 'particularsOfClaim')
  static readonly RESPONSE_PACK = new DocumentType('RESPONSE_PACK', 'Response pack', 'responsePack')
  static readonly MEDICAL_REPORTS = new DocumentType('MEDICAL_REPORTS', 'Medical reports', 'medicalReports')
  static readonly SCHEDULE_OF_LOSS = new DocumentType('SCHEDULE_OF_LOSS', 'Schedule of loss', 'scheduleOfLoss')
  static readonly OTHER = new DocumentType('OTHER', 'Other documents', 'other')

  readonly value: string
  readonly displayValue: string
  readonly dataStoreValue: string

  constructor (value: string, displayValue: string, dataStoreValue: string) {
    this.value = value
    this.displayValue = displayValue
    this.dataStoreValue = dataStoreValue
  }

  static all (): DocumentType[] {
    return [
      DocumentType.PARTICULARS_OF_CLAIM,
      DocumentType.RESPONSE_PACK,
      DocumentType.MEDICAL_REPORTS,
      DocumentType.SCHEDULE_OF_LOSS,
      DocumentType.OTHER
    ]
  }
}
