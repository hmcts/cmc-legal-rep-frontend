import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly homePage = new RoutablePath('/legal', false)
  static readonly logoutReceiver = new RoutablePath('/logout', false)
  static readonly receiver = new RoutablePath('/legal/receiver', false)

}
