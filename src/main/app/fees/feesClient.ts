import * as config from 'config'
import ClaimValidator from 'app/utils/claimValidator'
import request from 'client/request'
import { Fee } from 'fees/fee'

const feesUrl = config.get('fees.url')
const issueFeeCode = config.get<string>('fees.issueFeeCode')

export default class FeesClient {

  // TODO: Using this as tactical solution, will be replaced once fee service is ready for this scenario
  static readonly maxClaimValue = 10000000

  /**
   * Calculates the issue fee a claimant should pay based on the claim value
   *
   * @param {number} claimValue the amount claiming for in pounds
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateIssueFee (claimValue: number): Promise<number> {
    return this.callFeesRegister(issueFeeCode, claimValue)
      .then((fee: Fee) => this.convertPenniesToPounds(fee.amount))
  }

  /**
   * Calculates the maximum issue fee a claimant should pay as he has not provided the claim value
   *
   * @returns {Promise.<number>} promise containing the fee amount in pounds
   */
  static calculateMaxIssueFee (): Promise<number> {
    return this.callFeesRegister(issueFeeCode, FeesClient.maxClaimValue)
      .then((fee: Fee) => this.convertPenniesToPounds(fee.amount))
  }

  /**
   * Call the fees register
   * @param feeCode which fee category to use
   * @param amount amount in pounds
   * @returns {Promise.<Fee>} promise containing the fee amount in pennies
   */
  static callFeesRegister (feeCode: string, amount: number): Promise<Fee> {
    ClaimValidator.claimAmount(amount)
    const amountInPennies = this.convertPoundsToPennies(amount)
    if (amountInPennies <= 0) {
      throw new Error(`Amount must be at least 1 penny, amount was: ${amountInPennies}`)
    }

    return request.get(`${feesUrl}/range-groups/${feeCode}/calculations?value=${amountInPennies}`)
      .then((body: any) => new Fee(body.amount))
  }

  private static convertPenniesToPounds (amount: number) {
    return amount / 100
  }

  private static convertPoundsToPennies (amount: number) {
    return Math.round(amount * 100)
  }
}
