import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly claimantLoginReceiver = new RoutablePath('/claim/receiver')
  static readonly startPage = new RoutablePath('/claim/start')
  static readonly housingDisrepairPage = new RoutablePath('/claim/housing-disrepair')
  static readonly personalInjuryPage = new RoutablePath('/claim/personal-injury')
  static readonly yourReferencePage = new RoutablePath('/claim/your-reference')
  static readonly summariseTheClaimPage = new RoutablePath('/claim/summarise-the-claim')
  static readonly claimantAddressPage = new RoutablePath('/claim/claimant-address')
  static readonly claimAmountPage = new RoutablePath('/claim/amount')
  static readonly claimTotalPage = new RoutablePath('/claim/total')
  static readonly preferredCourtPage = new RoutablePath('/claim/preferred-court')
  static readonly representativeNamePage = new RoutablePath('/claim/representative-name')
  static readonly representativeContactsPage = new RoutablePath('/claim/representative-contacts')
  static readonly representativeAddressPage = new RoutablePath('/claim/representative-address')
  static readonly defendantTypePage = new RoutablePath('/claim/defendant-type')
  static readonly defendantAdditionPage = new RoutablePath('/claim/defendant-add')
  static readonly defendantRemovePage = new RoutablePath('/claim/defendant-remove')
  static readonly claimantTypePage = new RoutablePath('/claim/claimant-type')
  static readonly defendantAddressPage = new RoutablePath('/claim/defendant-address')
  static readonly defendantRepresentedPage = new RoutablePath('/claim/defendant-represented')
  static readonly defendantRepAddressPage = new RoutablePath('/claim/defendant-reps-address')
  static readonly statementOfTruthPage = new RoutablePath('/claim/statement-of-truth')
  static readonly payByAccountPage = new RoutablePath('/claim/pay-by-account')
  static readonly claimSubmittedPage = new RoutablePath('/claim/submitted')

}

export class ErrorPaths {
}
