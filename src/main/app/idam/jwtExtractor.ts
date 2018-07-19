import * as config from 'config'

export default class JwtExtractor {

  static extract (req: any): string {
    return req.cookies[config.get<string>('session.cookieName')]
  }

}
