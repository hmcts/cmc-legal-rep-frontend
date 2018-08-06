import * as config from 'config'

import { checkAuthorizationGuards as check } from 'test/routes/authorization-check'

export const accessDeniedPagePattern = new RegExp(`${config.get('idam.authentication-web.url')}/login\\?response_type=code&state=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}&client_id=cmc_legal&redirect_uri=https://127.0.0.1:[0-9]{1,5}/receiver`)

export function checkAuthorizationGuards (app: any, method: string, pagePath: string) {
  check(app, method, pagePath, accessDeniedPagePattern)
}
