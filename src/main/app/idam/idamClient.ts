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

  static retrieveAuthToken (url: string): Promise<AuthToken> {
    return request.get({ uri: url })
      .then((response: any) => {
        return new AuthToken(
          response.access_token,
          response.token_type,
          response.expires_in
        )
      })
  }
}
