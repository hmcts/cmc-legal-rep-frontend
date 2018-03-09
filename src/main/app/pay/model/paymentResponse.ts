import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'

class Fee {
  readonly code: string
  @Expose({ name: 'calculated_amount' })
  readonly amount: number
  readonly version: number
}

class NextURL {
  readonly href: string
  readonly method: string
}

class Links {
  @Type(() => NextURL)
  readonly cancel: NextURL

  @Expose({ name: 'next_url' })
  @Type(() => NextURL)
  readonly nextUrl: NextURL

  @Type(() => NextURL)
  readonly self: NextURL
}

export class PaymentResponse {

  @Expose({ name: '_links' })
  @Type(() => Links)
  links: Links

  @Expose({ name: 'account_number' })
  readonly accountNumber: string

  readonly amount: number

  @Expose({ name: 'case_reference' })
  readonly caseReference: string

  @Expose({ name: 'ccd_case_number' })
  readonly ccdCaseNumber: string

  readonly channel: string

  readonly currency: string

  @Expose({ name: 'customer_reference' })
  readonly customerReference: string

  @Expose({ name: 'date_created' })
  readonly dateCreated: string

  @Expose({ name: 'date_updated' })
  readonly dateUpdated: string

  readonly description: string

  @Expose({ name: 'external_provider' })
  readonly externalProvider: string

  @Expose({ name: 'external_reference' })
  readonly externalReference: string

  @Type(() => Fee)
  readonly fees: Fee[]

  readonly id: string

  readonly method: string

  @Expose({ name: 'organisation_name' })
  readonly organisationName: string

  @Expose({ name: 'payment_group_reference' })
  readonly paymentGroupReference: string

  @Expose({ name: 'payment_reference' })
  readonly paymentReference: string

  readonly reference: string

  @Expose({ name: 'service_name' })
  readonly serviceName: string

  @Expose({ name: 'site_id' })
  readonly siteId: string

  readonly status: string

  get isSuccess (): boolean {
    return this.status === 'Success' || this.status === 'Initiated'
  }
}
