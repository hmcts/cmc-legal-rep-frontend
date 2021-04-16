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
        Authorization: `eyJ0eXAiOiJKV1QiLCJ6aXAiOiJOT05FIiwia2lkIjoiWjRCY2pWZ2Z2dTVaZXhLekJFRWxNU200M0xzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJvY21jLmhtY3RzQGdtYWlsLmNvbSIsImN0cyI6Ik9BVVRIMl9TVEFURUxFU1NfR1JBTlQiLCJhdXRoX2xldmVsIjowLCJhdWRpdFRyYWNraW5nSWQiOiJjNGM1MmJlMy05YzQ4LTQ3M2UtOGM5ZC1lNjY3YjUwYjkxOGItMjI1NTI0OSIsImlzcyI6Imh0dHBzOi8vZm9yZ2Vyb2NrLWFtLnNlcnZpY2UuY29yZS1jb21wdXRlLWlkYW0tZGVtby5pbnRlcm5hbDo4NDQzL29wZW5hbS9vYXV0aDIvcmVhbG1zL3Jvb3QvcmVhbG1zL2htY3RzIiwidG9rZW5OYW1lIjoiYWNjZXNzX3Rva2VuIiwidG9rZW5fdHlwZSI6IkJlYXJlciIsImF1dGhHcmFudElkIjoicVhTNlFxQnJNeTZUX3F5VWh4clJ0UkJmYWQ0IiwiYXVkIjoiY21jX2NpdGl6ZW4iLCJuYmYiOjE2MTg0OTI0MDgsImdyYW50X3R5cGUiOiJhdXRob3JpemF0aW9uX2NvZGUiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicm9sZXMiXSwiYXV0aF90aW1lIjoxNjE4NDkyNDA3LCJyZWFsbSI6Ii9obWN0cyIsImV4cCI6MTYxODUyMTIwOCwiaWF0IjoxNjE4NDkyNDA4LCJleHBpcmVzX2luIjoyODgwMCwianRpIjoiTGc1Wk1BV0ZNWnVaa1hqZEZrZVdfTkNCdDBnIn0.a-Bys0S9GzNOeLmCWctwVIg_tklzveX78LQ5Y49T0L_8H0VFshBDaAjZOMGu0eSCG5dXIHZIRx1yxve6vLYdxMEPPixAXJijhuhKCCy34T_HmztfMT0-a4YoonxMdZGIEITjlMsCUJRjEKPvt5Ia_yMyOpyMzDj9h4R3szpQAFtBCRhMvpLs6v5jgHxacKx0Wu3Me7F0hLnHoDRGHcEPJbSlNZ3HchLRymkF1T8A_7mGqxRO2fOd5hNbv2yDMEV_oPtHIOZOKYJAAuLBp6XRJZmqQekBk92RTXEDHqp9tWXHY15YF0hZzdn2uh4RSyHFnyG7MimP0XutOdI0EGAZGw`,
        ServiceAuthorization: `eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjbWMiLCJleHAiOjE2MTg1MzI4MDl9.d6JlrwXZPPNd6KVt9_LRG0IFStnBifXHtAUb8aLQjnM_gRJQjV2Y0p5l-GoMbhXnS6f6b-wh9wzeUoKIAfvdAw`
      }
    })
    .catch(err => {
      let errorMessage
      let errorStatusMessage
      let statusCode
      if ((err.message !== 'socket hang up') && (err.code !== 'ECONNREFUSED') && (err.code !== 'ERR_INVALID_CHAR')) {
        if (err.error.error !== undefined) {
          errorMessage = err.error.error
        } else {
          errorMessage = err.error
          if (err.error.status_histories !== undefined) {
            errorStatusMessage = err.error.status_histories[0].error_code
          }
        }
        statusCode = err.statusCode
      } else if (err.code === 'ECONNREFUSED') {
        statusCode = 'ECONNREFUSED'
      } else {
        statusCode = 'Error'
      }
      const errorResponse: BaseParameters = {
        reference: err.message,
        status: 'Failed',
        errorCode: statusCode,
        errorMessage: errorMessage,
        errorCodeMessage: errorStatusMessage
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
