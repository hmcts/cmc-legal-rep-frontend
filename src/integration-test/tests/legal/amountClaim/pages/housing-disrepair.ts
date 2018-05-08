import I = CodeceptJS.I

const I: I = actor()

const fields = {
  housingDisrepairYes: 'input[id=housing_disrepair_yes]',
  housingDisrepairNo: 'input[id=housing_disrepair_no]',
  generalDamagesLess: 'input[id="generalDamages[value]LESS"]',
  generalDamagesMore: 'input[id="generalDamages[value]MORE"]',
  otherDamagesNone: 'input[id="otherDamages[value]NONE"]',
  otherDamagesLess: 'input[id="otherDamages[value]LESS"]',
  otherDamagesMore: 'input[id="otherDamages[value]MORE"]'
}

const buttons = {
  saveAndContinue: 'input.button'
}

export class ClaimHousingDisrepairPage {

  open (): void {
    I.amOnLegalAppPage('/claim/housing-disrepair')
  }

  enterHousingDisrepairGeneralDamagesLessThan1000 (): void {
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.generalDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairGeneralDamagesMoreThan1000 (): void {
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.generalDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairOtherDamagesLessThan1000 (): void {
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesLess)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairOtherDamagesMoreThan1000 (): void {
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesMore)
    I.click(buttons.saveAndContinue)
  }

  enterHousingDisrepairNoOtherDamages (): void {
    I.checkOption(fields.housingDisrepairYes)
    I.checkOption(fields.otherDamagesNone)
    I.click(buttons.saveAndContinue)
  }

  noHousingDisrepair (): void {
    I.checkOption(fields.housingDisrepairNo)
    I.click(buttons.saveAndContinue)
  }
}
