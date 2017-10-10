import * as moment from 'moment'

export default class CookieProperties {

  static getCookieParameters () {
    return {
      signed: true,
      expires: moment('2018-01-31').toDate()
    }
  }
}
