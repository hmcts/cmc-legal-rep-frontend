import * as config from 'config'

import request from 'client/request'
import User from 'idam/user'
import { AuthToken } from 'idam/authToken'
import { AuthTokenRequest } from 'idam/authTokenRequest'

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

  static createAuthToken (url: string, auth: string, body: AuthTokenRequest): Promise<AuthToken> {
    return request.post({
      uri: url,
      form: body,
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((response: any) => {
      return new AuthToken(
        response.access_token,
        response.token_type,
        response.expires_in
      )
    })
  }
}
