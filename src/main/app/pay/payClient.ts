import * as config from 'config'

import { ServiceAuthToken } from 'idam/serviceAuthToken'
import { User } from 'idam/user'
import { request } from 'client/request'
import { FeeResponse } from 'fees/model/feeResponse'
import StringUtils from 'utils/stringUtils'
import { PaymentResponse } from 'pay/model/paymentResponse'
import { plainToClass } from 'class-transformer'
import { BaseParameters } from 'pay/model/paymentErrorResponse'

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
        Authorization: 'eyJ0eXAiOiJKV1QiLCJ6aXAiOiJOT05FIiwia2lkIjoiWjRCY2pWZ2Z2dTVaZXhLekJFRWxNU200M0xzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJyYWNoaXQuc2F4ZW5hQGhtY3RzLm5ldCIsImN0cyI6Ik9BVVRIMl9TVEFURUxFU1NfR1JBTlQiLCJhdXRoX2xldmVsIjowLCJhdWRpdFRyYWNraW5nSWQiOiJjMGEyMmU3Mi1hYWM5LTQxMGMtYWQ2NS04MTg3NjQ4YWQ1ZWYtMjQ1MDMwOCIsImlzcyI6Imh0dHBzOi8vZm9yZ2Vyb2NrLWFtLnNlcnZpY2UuY29yZS1jb21wdXRlLWlkYW0tZGVtby5pbnRlcm5hbDo4NDQzL29wZW5hbS9vYXV0aDIvcmVhbG1zL3Jvb3QvcmVhbG1zL2htY3RzIiwidG9rZW5OYW1lIjoiYWNjZXNzX3Rva2VuIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImF1dGhHcmFudElkIjoiamdFdUdXWTRuYnBmTVd1MHpWT3VSZUtXQnFvIiwiYXVkIjoiY21jX2xlZ2FsIiwibmJmIjoxNjAzMjI0NzY4LCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIl0sImF1dGhfdGltZSI6MTYwMzIyNDc2MiwicmVhbG0iOiIvaG1jdHMiLCJleHAiOjE2MDMyNTM1NjgsImlhdCI6MTYwMzIyNDc2OCwiZXhwaXJlc19pbiI6Mjg4MDAsImp0aSI6InZfZEpIYklac251MDV3bzdlZXdhRG5iTnRLdyJ9.TD16a_nTjHPMGooYU6AtgEtLGnemj93n0viAVFL7uERdVbal1f9JkcNZiz6gBQX5h_4z-cmpwBGdpp5bxa58VQmXrAy-xYR_YEfZx_qn-rc4ujutHQmfUO3mnyy8RmGjAOjNIjavcV8jSQqc0BGY3lVtlsRgme-IYbZpLPs-UZ21J-vvvk26ASTglHnvut6WHbHzpfq7eV6HxlUZpqHlhu2cS3u8O04hqmsZe2QuxOArxZ9ntj77pAGkWnOVRcTAtTwE5GLUzWSonA-N8TgY7Gos639Z5zNR8qvRLD-m9cihefiobbf0kwu8jrw3ffhdEeV8Nd29Tin0YigIqDUubA',
        ServiceAuthorization: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE2MDMyMzc3NTh9.Mnu4pc4iR-paxe0fs56Qd4OHCUZsmuJTDmzvw2hHJ2J0wb4r42AdIV71Qf7gUd51KPE4Zrzqd2HzY9mRUj-kIA'
      }
    })
    .catch(err => {
      let errorMessage
      if (err.error.error !== undefined) {
        errorMessage = err.error.error
      } else {
        errorMessage = err.error
      }
      const errorResponse: BaseParameters = {
        reference: err.message,
        status: 'Failed',
        errorCode: err.statusCode,
        errorMessage: errorMessage
      }
      return plainToClass(PaymentResponse, errorResponse)
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
