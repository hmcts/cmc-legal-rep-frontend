Feature('Claimant Enter details of claim')

Scenario('I can fill in two claimants and update their details @legal', function * (I, legalUserSteps) {
  const userEmail = yield I.createSolicitorUser()
  legalUserSteps.loginAndStartClaim(userEmail)
  legalUserSteps.enterClaimantServiceDetails()
  legalUserSteps.enterClaimantTypeIndividual()
  I.see('Claimant: Mr Benugo')
  legalUserSteps.enterClaimantAddress()
  legalUserSteps.addAdditionalClaimant()
  legalUserSteps.enterClaimantTypeIndividual()
  I.see('Claimant 2: Mr Benugo')
  legalUserSteps.enterClaimantAddress()
  legalUserSteps.verifyAndChangeClaimantDetails()
})

Scenario('I can save organisation details and populate them in a subsequent claim via cookie info @legal', function * (I, legalUserSteps) {
  const userEmail = yield I.createSolicitorUser()
  legalUserSteps.loginAndStartClaim(userEmail)
  legalUserSteps.enterClaimantServiceDetails()
  legalUserSteps.startClaim()
  legalUserSteps.verifyOrganizationDetails()
})
