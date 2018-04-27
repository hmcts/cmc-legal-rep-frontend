import * as config from 'config'
import ClaimValidator from 'utils/claimValidator'
import { request } from 'client/request'
import { Amount } from 'forms/models/amount'
import { FeeResponse } from 'fees/model/feeResponse'
import { plainToClass } from 'class-transformer'
import StringUtils from 'utils/stringUtils'

const feesUrl = config.get<string>('fees.url')
const service = config.get<string>('fees.service')
const jurisdiction1 = config.get<string>('fees.jurisdiction1')
const jurisdiction2 = config.get<string>('fees.jurisdiction2')
const paperChannel = config.get<string>('fees.channel.paper')
const issueFeeEvent = config.get<string>('fees.issueFee.event')

export default class FeesClient {

  static getFeeAmount (claimAmount: Amount): Promise<FeeResponse> {
    if (claimAmount.canNotState()) {
      return FeesClient.calculateMaxIssueFee()
        .then((feeResponse: FeeResponse) => feeResponse)
    } else {
      return FeesClient.calculateIssueFee(claimAmount.higherValue)
        .then((feeResponse: FeeResponse) => feeResponse)
    }
  }

  /**
   * Calculates the issue fee a claimant should pay based on the claim value
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<FeeResponse>} promise containing the fee amount in pennies
   */
  static async calculateIssueFee (claimValue: number): Promise<FeeResponse> {
    if (StringUtils.isBlank(issueFeeEvent)) {
      throw new Error('Fee eventType is required')
    }
    if (StringUtils.isBlank(paperChannel)) {
      throw new Error('Fee channel is required')
    }
    ClaimValidator.claimAmount(claimValue)
    const feeUri: string = `${feesUrl}/fees-register/fees/lookup?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${paperChannel}&event=${issueFeeEvent}&amount_or_volume=${claimValue}`
    const fee: object = await request.get(feeUri)
    return plainToClass(FeeResponse, fee)
  }

  /**
   * Calculates the maximum issue fee a claimant should pay as he has not provided the claim value
   *
   * @returns {Promise.<FeeResponse>} promise containing the fee amount in pennies
   */
  static async calculateMaxIssueFee (): Promise<FeeResponse> {
    if (StringUtils.isBlank(issueFeeEvent)) {
      throw new Error('Fee eventType is required')
    }
    if (StringUtils.isBlank(paperChannel)) {
      throw new Error('Fee channel is required')
    }
    const feeUri: string = `${feesUrl}/fees-register/fees/lookup-unspecified?service=${service}&jurisdiction1=${jurisdiction1}&jurisdiction2=${jurisdiction2}&channel=${paperChannel}&event=${issueFeeEvent}`
    const fee: object = await request.get(feeUri)
    return plainToClass(FeeResponse, fee)
  }
}
