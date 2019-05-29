import * as config from 'config'

import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { User } from 'idam/user'
import { request } from 'client/request'
import { FeeResponse } from 'fees/model/feeResponse'
import StringUtils from 'utils/stringUtils'
import { PaymentResponse } from 'pay/model/paymentResponse'
import { plainToClass } from 'class-transformer'

const payUrl = config.get<string>('pay.url')
const payPath = config.get<string>('pay.path')
const paymentURL = `${config.get('pay.url')}/payments`
const serviceName = config.get<string>('pay.service-name')
const currency = config.get<string>('pay.currency')
const siteId = config.get<string>('pay.site-id')
const description = config.get<string>('pay.description')

export class PayClient {
  constructor (public serviceAuthToken: ServiceAuthToken) {
    this.serviceAuthToken = serviceAuthToken
  }

  async create (user: User,
                pbaAccount: string,
                externalId: string,
                customerReference: string,
                organisationName: string,
                fee: FeeResponse,
                caseReference: string): Promise<PaymentResponse> {
    const paymentReq: object = this.preparePaymentRequest(
      pbaAccount,
      externalId,
      customerReference,
      organisationName,
      fee,
      caseReference
    )
    const response: object = await request.post({
      uri: `${payUrl}/${payPath}`,
      body: paymentReq,
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
    return plainToClass(PaymentResponse, response)
  }

  async update (user: User,
                paymentReference: string,
                caseReference: string,
                caseNumber: string): Promise<PaymentResponse> {
    if (!user) {
      throw new Error('User is required')
    }
    if (StringUtils.isBlank(paymentReference)) {
      throw new Error('Payment reference is required')
    }
    if (StringUtils.isBlank(caseReference)) {
      throw new Error('Case Reference is required')
    }
    if (StringUtils.isBlank(caseNumber)) {
      throw new Error('Case Number is required')
    }
    const response: object = await request.patch({
      uri: `${paymentURL}/${paymentReference}`,
      body: this.preparePaymentUpdateRequest(caseReference, caseNumber),
      headers: {
        Authorization: `Bearer ${user.bearerToken}`,
        ServiceAuthorization: `Bearer ${this.serviceAuthToken.bearerToken}`
      }
    })
    return plainToClass(PaymentResponse, response)
  }

  private preparePaymentRequest (pbaAccount: string,
                                 externalId: string,
                                 customerReference: string,
                                 organisationName: string,
                                 fee: FeeResponse,
                                 caseReference: string): object {
    if (StringUtils.isBlank(pbaAccount)) {
      throw new Error('Missing required parameter pbaAccount')
    }
    if (StringUtils.isBlank(externalId)) {
      throw new Error('Missing required parameter externalId')
    }
    if (StringUtils.isBlank(caseReference)) {
      throw new Error('Missing required parameter caseReference')
    }
    if (fee == null || fee.amount < 0) {
      throw new Error('Fee amount must be a valid numeric value')
    }
    if (StringUtils.isBlank(customerReference)) {
      customerReference = 'not-provided'
    }
    return {
      amount: fee.amount,
      description: description,
      case_reference: externalId,
      ccd_case_number: caseReference === externalId ? 'UNKNOWN' : caseReference,
      service: serviceName,
      currency: currency,
      customer_reference: customerReference,
      organisation_name: organisationName,
      account_number: pbaAccount,
      site_id: siteId,
      fees: [
        {
          calculated_amount: fee.amount,
          code: fee.code,
          version: fee.version
        }
      ]
    }
  }

  private preparePaymentUpdateRequest (caseReference: string, caseNumber: string): object {
    return {
      case_reference: caseReference,
      ccd_case_number: caseNumber
    }
  }
}
