import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly claimantLoginReceiver = new RoutablePath('/claim/receiver')
  static readonly startPage = new RoutablePath('/claim/start')
  static readonly housingDisrepairPage = new RoutablePath('/claim/housing-disrepair')
  static readonly personalInjuryPage = new RoutablePath('/claim/personal-injury')
  static readonly yourReferencePage = new RoutablePath('/claim/your-reference')
  static readonly summariseTheClaimPage = new RoutablePath('/claim/summarise-the-claim')
  static readonly preferredCourtPage = new RoutablePath('/claim/preferred-court')
  static readonly representativeNamePage = new RoutablePath('/claim/representative-name')
  static readonly representativeContactsPage = new RoutablePath('/claim/representative-contacts')
  static readonly representativeAddressPage = new RoutablePath('/claim/representative-address')
}

export class ErrorPaths {
}
