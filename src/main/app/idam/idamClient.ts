import * as config from 'config'

import request from 'client/request'
import User from 'idam/user'
import { AuthToken } from 'idam/authToken'

const idamApiUrl = config.get<string>('idam.api.url')

export default class IdamClient {

  static retrieveUserFor (jwt: string): Promise<User> {
    return request.get({
      uri: `${idamApiUrl}/details`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).then((response: any) => {
      return new User(
        response.id,
        response.email,
        response.forename,
        response.surname,
        response.roles,
        response.group,
        jwt
      )
    })
  }

  static exchangeCode (code: string, redirectUri: string): Promise<AuthToken> {
    const clientId = config.get<string>('oauth.clientId')
    const clientSecret = config.get<string>('oauth.clientSecret')
    const url = `${config.get('idam.api.url')}/oauth2/token`

    return request.post({
      uri: url,
      auth: {
        username: clientId,
        password: clientSecret
      },
      form: { grant_type: 'authorization_code', code: code, redirect_uri: redirectUri }
    })
      .then((response: any) => {
        return new AuthToken(
          response.access_token,
          response.token_type,
          response.expires_in
        )
      })
  }
}
