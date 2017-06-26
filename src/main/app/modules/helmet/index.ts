import * as express from 'express'
import * as helmet from 'helmet'

/**
 * Module that enables helmet for Express.js applications
 */
export default class Helmet {

  constructor (public developmentMode: boolean) {
    this.developmentMode = developmentMode
  }

  enableFor (app: express.Express) {
    const selfCsp = '\'self\''
    let scriptCsp = [selfCsp, '*.google-analytics.com', 'hmctspiwik.useconnect.co.uk']
    let imgCsp = [selfCsp,'*.google-analytics.com', 'hmctspiwik.useconnect.co.uk']
    let connectCsp = [selfCsp]
    if (this.developmentMode) {
      scriptCsp.push('http://localhost:35729')
      connectCsp.push('ws://localhost:35729')
    }

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ['\'none\''],
          fontSrc: [selfCsp, 'data:'],
          scriptSrc: scriptCsp,
          connectSrc: connectCsp,
          objectSrc: [selfCsp],
          imgSrc: imgCsp,
          styleSrc: [selfCsp]
        }
      }
    }))
  }
}
