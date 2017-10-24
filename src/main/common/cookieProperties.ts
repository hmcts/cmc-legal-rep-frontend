export default class CookieProperties {

  static getCookieParameters () {
    return {
      signed: true,
      httpOnly: true,
      maxAge: 7889238000,
      secure: true
    }
  }

  static getCookieConfig () {
    return {
      options: {
        algorithm: 'aes128'
      }
    }
  }
}
