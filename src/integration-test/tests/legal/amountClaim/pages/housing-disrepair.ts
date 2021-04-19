import I = CodeceptJS.I

const I: I = actor()

const fields = {
  housingDisrepairYes:  { css: 'input[id=housing_disrepair_yes]' },
  housingDisrepairNo:   { css: 'input[id=housing_disrepair_no]' },
  generalDamagesLess:   { css: 'input[id="generalDamages[value]LESS"]' },
  generalDamagesMore:   { css: 'input[id="generalDamages[value]MORE"]' },
  otherDamagesNone:     { css: 'input[id="otherDamages[value]NONE"]' },
  otherDamagesLess:     { css: 'input[id="otherDamages[value]LESS"]' },
  otherDamagesMore:     { css: 'input[id="otherDamages[value]MORE"]' }
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimHousingDisrepairPage {

  open (): void {
    I.amOnLegalAppPage('/claim/housing-disrepair')
  }

  enterHousingDisrepairGeneralDamagesLessThan1000 (): void {
    I.waitForElement(fields.housingDisrepairYes)
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.generalDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairGeneralDamagesMoreThan1000 (): void {
    I.waitForElement(fields.housingDisrepairYes)
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.generalDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairOtherDamagesLessThan1000 (): void {
    I.waitForElement(fields.housingDisrepairYes)
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairOtherDamagesMoreThan1000 (): void {
    I.waitForElement(fields.housingDisrepairYes)
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairNoOtherDamages (): void {
    I.waitForElement(fields.housingDisrepairYes)
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesNone)
    I.click(buttons.saveAndContinue)
  }

  noHousingDisrepair (): void {
    I.waitForElement(fields.housingDisrepairNo)
    I.checkOption(fields.housingDisrepairNo)
    I.click(buttons.saveAndContinue)
  }
}
