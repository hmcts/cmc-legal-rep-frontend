export default class ClaimValidator {

  public static claimAmount (claimAmount: number) {
    if (claimAmount == null || claimAmount < 0) {
      throw new Error('Claim amount must be a valid numeric value')
    }
  }
}
