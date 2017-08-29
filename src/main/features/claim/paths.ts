import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly startPage = new RoutablePath('/legal/claim/start')
  static readonly housingDisrepairPage = new RoutablePath('/legal/claim/housing-disrepair')
  static readonly personalInjuryPage = new RoutablePath('/legal/claim/personal-injury')
  static readonly yourReferencePage = new RoutablePath('/legal/claim/your-reference')
  static readonly summariseTheClaimPage = new RoutablePath('/legal/claim/summarise-the-claim')
  static readonly claimantAddressPage = new RoutablePath('/legal/claim/claimant-address')
  static readonly claimAmountPage = new RoutablePath('/legal/claim/amount')
  static readonly claimTotalPage = new RoutablePath('/legal/claim/total')
  static readonly preferredCourtPage = new RoutablePath('/legal/claim/preferred-court')
  static readonly representativeNamePage = new RoutablePath('/legal/claim/representative-name')
  static readonly representativeContactsPage = new RoutablePath('/legal/claim/representative-contacts')
  static readonly representativeAddressPage = new RoutablePath('/legal/claim/representative-address')
  static readonly defendantTypePage = new RoutablePath('/legal/claim/defendant-type')
  static readonly defendantAdditionPage = new RoutablePath('/legal/claim/defendant-add')
  static readonly defendantRemovePage = new RoutablePath('/legal/claim/defendant-remove')
  static readonly claimantTypePage = new RoutablePath('/legal/claim/claimant-type')
  static readonly defendantAddressPage = new RoutablePath('/legal/claim/defendant-address')
  static readonly defendantRepresentedPage = new RoutablePath('/legal/claim/defendant-represented')
  static readonly defendantRepAddressPage = new RoutablePath('/legal/claim/defendant-reps-address')
  static readonly statementOfTruthPage = new RoutablePath('/legal/claim/statement-of-truth')
  static readonly payByAccountPage = new RoutablePath('/legal/claim/pay-by-account')
  static readonly claimSubmittedPage = new RoutablePath('/legal/claim/:externalId/submitted')
  static readonly detailsSummaryPage = new RoutablePath('/legal/claim/details-summary')

}
