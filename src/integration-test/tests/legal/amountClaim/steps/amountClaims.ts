import { ClaimPersonalInjuryPage } from 'integration-test/tests/legal/amountClaim/pages/personal-injury'
import { ClaimHousingDisrepairPage } from 'integration-test/tests/legal/amountClaim/pages/housing-disrepair'
import { ClaimSummariseTheClaimPage } from 'integration-test/tests/legal/amountClaim/pages/summarise-the-claim'
import { ClaimAmountPage } from 'integration-test/tests/legal/amountClaim/pages/amount'
import { ClaimTotalPage } from 'integration-test/tests/legal/amountClaim/pages/total'
import { ClaimDetailsSummaryPage } from 'integration-test/tests/legal/amountClaim/pages/details-summary'
import { ClaimStatementOfTruthPage } from 'integration-test/tests/legal/amountClaim/pages/statement-of-truth'
import { ClaimPayByAccountPage } from 'integration-test/tests/legal/amountClaim/pages/pay-by-account'
import { ClaimSubmittedPage } from 'integration-test/tests/legal/amountClaim/pages/submitted'

const personalInjuryPage: ClaimPersonalInjuryPage = new ClaimPersonalInjuryPage()
const housingDisrepairPage: ClaimHousingDisrepairPage = new ClaimHousingDisrepairPage()
const summariseTheClaimPage: ClaimSummariseTheClaimPage = new ClaimSummariseTheClaimPage()
const amountPage: ClaimAmountPage = new ClaimAmountPage()
const totalPage: ClaimTotalPage = new ClaimTotalPage()
const detailsSummaryPage: ClaimDetailsSummaryPage = new ClaimDetailsSummaryPage()
const statementOfTruthPage: ClaimStatementOfTruthPage = new ClaimStatementOfTruthPage()
const payByAccountPage: ClaimPayByAccountPage = new ClaimPayByAccountPage()
const submittedPage: ClaimSubmittedPage = new ClaimSubmittedPage()

export class AmountClaimSteps {
  personalInjuryLessThan1000 (): void {
    personalInjuryPage.enterPersonalInjuryLessThan1000()
  }

  personalInjuryMoreThan1000 (): void {
    personalInjuryPage.open()
    personalInjuryPage.enterPersonalInjuryMoreThan1000()
  }

  noPersonalInjuryClaim (): void {
    personalInjuryPage.noPersonalInjury()
  }

  housingDisrepairLessThan1000 (): void {
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesLessThan1000()
    housingDisrepairPage.enterHousingDisrepairOtherDamagesLessThan1000()
  }

  housingDisrepairMoreThan1000 (): void {
    housingDisrepairPage.open()
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesMoreThan1000()
    housingDisrepairPage.enterHousingDisrepairOtherDamagesMoreThan1000()
  }

  housingDisrepairLessThan1000AndNoOtherDamages (): void {
    housingDisrepairPage.open()
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesLessThan1000()
    housingDisrepairPage.enterHousingDisrepairNoOtherDamages()
  }

  noHousingDisrepairClaim (): void {
    housingDisrepairPage.noHousingDisrepair()
  }

  summariseTheClaim (): void {
    summariseTheClaimPage.enterBriefDescriptionOfTheClaim()
  }

  enterRangeOfTheClaim (): void {
    amountPage.enterRangeOfTheClaim()
  }

  enterOnlyHigherValueAmount (): void {
    amountPage.open()
    amountPage.enterHigherValueOfTheClaim()
  }

  canNotStateTheClaimValue (): void {
    amountPage.canNotStateTheClaim()
  }

  feeCheckForRangeTotal (): void {
    totalPage.checkFeeTotalForRange()
  }

  feeCheckForCanNotStateTheClaimValue (): void {
    totalPage.checkFeeTotalForCanNotStateValue()
  }

  addRangeDetailsAndVerifyIndividualDetails (): void {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifyIndividualSummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addRangeDetailsAndVerifyOrganisationDetails (): void {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifySummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addMandatoryClaimDataAndSubmitClaim (): void {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    detailsSummaryPage.selectSubmitButton()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addNoClaimDataAndVerifyData (): void {
    this.noPersonalInjuryClaim()
    this.noHousingDisrepairClaim()
    this.summariseTheClaim()
    this.canNotStateTheClaimValue()
    this.feeCheckForCanNotStateTheClaimValue()
    this.verifyNoClaimSummaryDetails()
  }

  verifySummaryDetails (): void {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.claimantDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }

  verifySummaryDetailsForMultipleClaimants (): void {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.multipleClaimantsDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }

  verifyNoClaimSummaryDetails (): void {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.claimantDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaimWithNoClaimValue()
    detailsSummaryPage.selectSubmitButton()
  }

  verifyIndividualSummaryDetails (): void {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.individualClaimDetails()
    detailsSummaryPage.individualDefendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }

  addAmountAndVerifyDetails (): void {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifySummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
  }

  addStatementOfTruthSignerNameAndRole (): void {
    statementOfTruthPage.enterStatementOfTruthSignerNameAndRole()
  }

  addPayByAccountFeeNumber (): void {
    payByAccountPage.enterFeeAccountNumber()
  }

  verifySubmittedPage (userEmail: string, dateCheck: string): void {
    submittedPage.verifyTextInSubmittedPage(userEmail, dateCheck)
  }

}
