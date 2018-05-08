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
  // todo never used? remove
  openPage () {
    personalInjuryPage.open()
    housingDisrepairPage.open()
    summariseTheClaimPage.open()
    amountPage.open()
    totalPage.open()
    detailsSummaryPage.open()
    statementOfTruthPage.open()
    payByAccountPage.open()
    submittedPage.open()
  }

  personalInjuryLessThan1000 () {
    personalInjuryPage.enterPersonalInjuryLessThan1000()
  }

  personalInjuryMoreThan1000 () {
    personalInjuryPage.open()
    personalInjuryPage.enterPersonalInjuryMoreThan1000()
  }

  noPersonalInjuryClaim () {
    personalInjuryPage.noPersonalInjury()
  }

  housingDisrepairLessThan1000 () {
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesLessThan1000()
    housingDisrepairPage.enterHousingDisrepairOtherDamagesLessThan1000()
  }

  housingDisrepairMoreThan1000 () {
    housingDisrepairPage.open()
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesMoreThan1000()
    housingDisrepairPage.enterHousingDisrepairOtherDamagesMoreThan1000()
  }

  housingDisrepairLessThan1000AndNoOtherDamages () {
    housingDisrepairPage.open()
    housingDisrepairPage.enterHousingDisrepairGeneralDamagesLessThan1000()
    housingDisrepairPage.enterHousingDisrepairNoOtherDamages()
  }

  noHousingDisrepairClaim () {
    housingDisrepairPage.noHousingDisrepair()
  }

  summariseTheClaim () {
    summariseTheClaimPage.enterBriefDescriptionOfTheClaim()
  }

  enterRangeOfTheClaim () {
    amountPage.enterRangeOfTheClaim()
  }

  enterOnlyHigherValueAmount () {
    amountPage.open()
    amountPage.enterHigherValueOfTheClaim()
  }

  canNotStateTheClaimValue () {
    amountPage.canNotStateTheClaim()
  }

  feeCheckForRangeTotal () {
    totalPage.checkFeeTotalForRange()
  }

  feeCheckForCanNotStateTheClaimValue () {
    totalPage.checkFeeTotalForCanNotStateValue()
  }

  addRangeDetailsAndVerifyIndividualDetails () {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifyIndividualSummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addRangeDetailsAndVerifyOrganisationDetails () {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifySummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addMandatoryClaimDataAndSubmitClaim () {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    detailsSummaryPage.selectSubmitButton()
    this.addStatementOfTruthSignerNameAndRole()
    this.addPayByAccountFeeNumber()
  }

  addNoClaimDataAndVerifyData () {
    this.noPersonalInjuryClaim()
    this.noHousingDisrepairClaim()
    this.summariseTheClaim()
    this.canNotStateTheClaimValue()
    this.feeCheckForCanNotStateTheClaimValue()
    this.verifyNoClaimSummaryDetails()
  }

  verifySummaryDetails () {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.claimantDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }

  verifySummaryDetailsForMultipleClaimants () {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.multipleClaimantsDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }
  verifyNoClaimSummaryDetails () {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.claimantDetails()
    detailsSummaryPage.defendantDetails()
    detailsSummaryPage.aboutThisClaimWithNoClaimValue()
    detailsSummaryPage.selectSubmitButton()
  }
  verifyIndividualSummaryDetails () {
    detailsSummaryPage.verifyOrganizationDetails()
    detailsSummaryPage.individualClaimDetails()
    detailsSummaryPage.individualDefendantDetails()
    detailsSummaryPage.aboutThisClaim()
    detailsSummaryPage.selectSubmitButton()
  }

  addAmountAndVerifyDetails () {
    this.personalInjuryLessThan1000()
    this.housingDisrepairLessThan1000()
    this.summariseTheClaim()
    this.enterRangeOfTheClaim()
    this.feeCheckForRangeTotal()
    this.verifySummaryDetails()
    this.addStatementOfTruthSignerNameAndRole()
  }

  addStatementOfTruthSignerNameAndRole () {
    statementOfTruthPage.enterStatementOfTruthSignerNameAndRole()
  }
  addPayByAccountFeeNumber () {
    payByAccountPage.enterFeeAccountNumber()
  }

  verifySubmittedPage (userEmail, dateCheck) {
    submittedPage.verifyTextInSubmittedPage(userEmail, dateCheck)
  }

}
