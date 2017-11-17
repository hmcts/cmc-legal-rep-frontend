import * as config from 'config'
import ClaimValidator from 'app/utils/claimValidator'
import { request } from 'client/request'
import { Amount } from 'forms/models/amount'
import MoneyConverter from 'app/fees/moneyConverter'
import { FeeResponse } from 'fees/model/feeResponse'
import { plainToClass } from 'class-transformer'

const feesUrl = config.get('fees.url')
const issueFeeCode = config.get<string>('fees.issueFeeCode')

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
  static calculateIssueFee (claimValue: number): Promise<FeeResponse> {
    return this.callFeesRegister(issueFeeCode, claimValue)
      .then((feeResponse: FeeResponse) => feeResponse)
  }

  /**
   * Calculates the maximum issue fee a claimant should pay as he has not provided the claim value
   *
   * @returns {Promise.<FeeResponse>} promise containing the fee amount in pennies
   */
  static calculateMaxIssueFee (): Promise<FeeResponse> {
    return request.get(`${feesUrl}/range-groups/${issueFeeCode}/calculations/unspecified`)
      .then((body: any) => plainToClass(FeeResponse, body))
  }

  /**
   * Call the fees register
   * @param feeCode which fee category to use
   * @param amount amount in pounds
   * @returns {Promise.<FeeResponse>} promise containing the fee amount in pennies
   */
  static callFeesRegister (feeCode: string, amount: number): Promise<FeeResponse> {
    ClaimValidator.claimAmount(amount)
    const amountInPennies = MoneyConverter.convertPoundsToPennies(amount)
    if (amountInPennies <= 0) {
      throw new Error(`Amount must be at least 1 penny, amount was: ${amountInPennies}`)
    }

    return request.get(`${feesUrl}/range-groups/${feeCode}/calculations?value=${amountInPennies}`)
      .then((body: any) => plainToClass(FeeResponse, body))
  }

}
