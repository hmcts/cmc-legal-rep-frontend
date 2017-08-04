import * as config from 'config'

import request from 'client/request'
import User from 'idam/user'

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
}
