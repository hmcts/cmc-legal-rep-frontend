import { expect } from 'chai'
import { mockReq as req } from 'sinon-express-mock'
import { buildURL } from 'app/utils/callbackBuilder'

describe('CallbackBuilder', () => {

  describe(`buildURL should create URL `, () => {
    it('for SSL request ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = true
      req.headers = { host: 'localhost' }
      let url = buildURL(req, path)

      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })

    it('for force SSL option ', () => {
      const path = 'my/service/path'
      const expected = `https://localhost/${path}`
      req.secure = false
      req.headers = { host: 'localhost' }
      let url = buildURL(req, path, true)

      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })

    it('for non SSL request ', () => {
      const path = 'my/service/path'
      const expected = `http://localhost/${path}`
      req.secure = false
      req.headers = { host: 'localhost' }

      let url = buildURL(req, path)
      expect(url.length).gt(0)
      expect(url).to.eq(expected)
    })
  })

})
