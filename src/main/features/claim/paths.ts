import { RoutablePath } from 'common/router/routablePath'

export class Paths {
  static readonly claimantLoginReceiver = new RoutablePath('/claim/receiver')
  static readonly startPage = new RoutablePath('/claim/start')
  static readonly dashboardPage = new RoutablePath('/claim/dashboard')
  static readonly taskListPage = new RoutablePath('/claim/task-list')
}

export class ErrorPaths {
  static readonly amountExceededPage = new RoutablePath('/claim/amount-exceeded')
}
