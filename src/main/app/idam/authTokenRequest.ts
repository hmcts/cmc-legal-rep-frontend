/* tslint:disable */
export class AuthTokenRequest {
  constructor (public readonly grant_type: string,
               public readonly code: string,
               public readonly redirect_uri: string) {
    this.grant_type = grant_type
    this.code = code
    this.redirect_uri = redirect_uri
  }
}
