import { request } from 'integration-test/helpers/clients/base/request'

const baseURL: string = process.env.IDAM_URL

const defaultPassword = 'Password12'

const oauth2 = {
  client_id: 'cmc_legal',
  redirect_uri: `${process.env.CITIZEN_APP_URL}/legal/receiver`,
  client_secret: process.env.OAUTH2_CLIENT_SECRET
}

export class IdamClient {

  /**
   * Creates user with default password
   *
   * @param {string} email
   * @param {string} userGroupCode
   * @param {string} password
   * @returns {Promise<void>}
   */
  static createUser (email: string, userGroupCode: string, password: string = undefined): Promise<void> {
    return request.post({
      uri: `${baseURL}/testing-support/accounts`,
      body: {
        email: email,
        forename: 'John',
        surname: 'Smith',
        levelOfAccess: 1,
        userGroup: {
          code: userGroupCode
        },
        activationDate: '',
        lastAccess: '',
        password: password ? password : defaultPassword
      }
    })
  }

  /**
   * Authenticate user
   *
   * @param {string} username the username to authenticate
   * @param password the users password (optional, default will be used if none provided)
   * @returns {Promise<string>}
   */
  static async authenticateUser (username: string, password: string = undefined): Promise<string> {

    const base64Authorisation: string = IdamClient.toBase64(`${username}:${password || defaultPassword}`)
    const oauth2Params: string = IdamClient.toUrlParams(oauth2)
    const authResponse = await request.post({
      url: `${baseURL}/oauth2/authorize?response_type=code&${oauth2Params}`,
      headers: {
        Authorization: `Basic ${base64Authorisation}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    return IdamClient.exchangeCode(authResponse['code'])
  }

  static exchangeCode (code: string): Promise<string> {

    return request.post({
      uri: `${baseURL}/oauth2/token`,
      auth: {
        username: oauth2.client_id,
        password: oauth2.client_secret
      },
      form: { grant_type: 'authorization_code', code: code, redirect_uri: oauth2.redirect_uri }
    })
      .then((response: any) => {
        return response['access_token']
      })
  }

  /**
   * Retrieves uses details
   *
   * @param {string} jwt
   * @returns {Promise<User>}
   */
  static retrieveUser (jwt: string): Promise<User> {
    return request.get({
      uri: `${baseURL}/details`,
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
  }

  private static toBase64 (value: string): string {
    return Buffer.from(value).toString('base64')
  }

  private static toUrlParams (value: object): string {
    return Object.entries(value).map(([key, val]) => `${key}=${val}`).join('&')
  }

}
