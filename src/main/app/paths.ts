import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly homePage = new RoutablePath('/', false)
  static readonly logoutReceiver = new RoutablePath('/logout', false)
  static readonly oldReceiver = new RoutablePath('/legal/receiver', false)
  static readonly receiver = new RoutablePath('/receiver', false)
  static readonly analyticsReceiver = new RoutablePath('/analytics', false)
  static readonly accessibilityPage = new RoutablePath('/accessibility-statement', false)

}
