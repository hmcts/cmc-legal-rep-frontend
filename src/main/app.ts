import * as express from 'express'
import * as config from 'config'
import * as path from 'path'
import * as favicon from 'serve-favicon'
import * as cookieParser from 'cookie-parser'
import * as cookieEncrypter from 'cookie-encrypter'
import * as bodyParser from 'body-parser'
import { RequestTracing, Logger } from '@hmcts/nodejs-logging'
import { ForbiddenError, NotFoundError } from './errors'
import { ErrorLogger } from 'logging/errorLogger'
import { RouterFinder } from 'common/router/routerFinder'
import { Config as HelmetConfig, Helmet } from 'modules/helmet'
import { I18Next } from 'modules/i18n'
import Nunjucks from 'modules/nunjucks'

import { Feature as ClaimIssueFeature } from 'claim/index'
import { Feature as CertificateOfServiceFeature } from 'certificateOfService/index'
import { CsrfProtection } from 'modules/csrf'
import { DashboardFeature } from 'dashboard/index'
import CookieProperties from 'common/cookieProperties'
import healthEndpoint from 'routes/health'
import * as toBoolean from 'to-boolean'
import { FeatureToggles } from 'utils/featureToggles'

export const app: express.Express = express()

Logger.config({
  microservice: 'cmc-legal-rep-frontend',
  team: 'cmc',
  environment: process.env.NODE_ENV
})

const env = process.env.NODE_ENV || 'development'
app.locals.ENV = env

const developmentMode = env === 'development'

app.use(RequestTracing.middleware)

const i18next = I18Next.enableFor(app)

new Nunjucks(developmentMode, i18next)
  .enableFor(app)
new Helmet(config.get<HelmetConfig>('security'), developmentMode)
  .enableFor(app)

app.enable('trust proxy')
app.use(favicon(path.join(__dirname, '/public/img/lib/favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cookieParser(config.get('session.encryptionKey')))
app.use(cookieEncrypter(config.get('session.encryptionKey'), CookieProperties.getCookieConfig()))

app.use('/legal', express.static(path.join(__dirname, 'public')))
app.use('/robots.txt', express.static(path.join(__dirname, 'public/robots.txt')))

if (env !== 'mocha') {
  new CsrfProtection().enableFor(app)
}

new ClaimIssueFeature().enableFor(app)
if (toBoolean(config.get<boolean>('featureToggles.certificateOfService'))) {
  new CertificateOfServiceFeature().enableFor(app)
}
if (toBoolean(config.get<boolean>('featureToggles.dashboard'))) {
  new DashboardFeature().enableFor(app)
}

app.use('/', healthEndpoint)
app.use('/legal', RouterFinder.findAll(path.join(__dirname, 'routes')))

// Below will match all routes not covered by the router, which effectively translates to a 404 response
app.use((req, res, next) => {
  next(new NotFoundError(req.path))
})

// error handlers
const errorLogger = new ErrorLogger()
app.use((err, req, res, next) => {
  errorLogger.log(err)
  res.status(err.statusCode || 500)
  if (err.associatedView) {
    res.render(err.associatedView)
  } else if (err.statusCode === 403) {
    res.render(new ForbiddenError().associatedView)
  } else {
    const view = FeatureToggles.isEnabled('returnErrorToUser') ? 'error_dev' : 'error'
    res.render(view, {
      error: err,
      title: 'error'
    })
  }
  next()
})
