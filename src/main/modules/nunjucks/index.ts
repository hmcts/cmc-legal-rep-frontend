import { TranslationOptions } from 'i18next'
import * as path from 'path'
import * as express from 'express'
// import * as config from 'config'
import * as nunjucks from 'nunjucks'
import * as dateFilter from 'nunjucks-date-filter'
import * as numeralFilter from 'nunjucks-numeral-filter'
import * as numeral from 'numeral'

const packageDotJson = require('../../../../package.json')
import { LONG_DATE_FORMAT } from 'app/utils/momentFormatter'
import { NUMBER_FORMAT } from 'app/utils/numberFormatter'

const appAssetPaths = {
  js: '/js',
  js_vendor: '/js/lib',
  style: '/stylesheets',
  style_vendor: '/stylesheets/lib',
  images_vendor: '/img/lib'
}

export default class Nunjucks {

  constructor (public developmentMode: boolean, public i18next) {
    this.developmentMode = developmentMode
    this.i18next = i18next
  }

  enableFor (app: express.Express) {
    app.set('view engine', 'njk')
    const nunjucksEnv = nunjucks.configure([
      path.join(__dirname, '..', '..', 'views'),
      path.join(__dirname, '..', '..', 'public', 'macros'),
      path.join(__dirname, '..', '..', 'features')
    ], {
      autoescape: true,
      express: app
    })

    require('numeral/locales/en-gb')
    numeral.locale('en-gb')
    numeral.defaultFormat(NUMBER_FORMAT)
    dateFilter.setDefaultFormat(LONG_DATE_FORMAT)

    nunjucksEnv.addGlobal('asset_paths', appAssetPaths)
    nunjucksEnv.addGlobal('serviceName', 'Money Claim')
    nunjucksEnv.addGlobal('development', this.developmentMode)
    nunjucksEnv.addGlobal('govuk_template_version', packageDotJson.dependencies.govuk_template_jinja)
    // nunjucksEnv.addGlobal('gaTrackingId', config.get<string>('citizen-frontend.gaTrackingId'))
    // nunjucksEnv.addGlobal('piwikTrackingId', config.get<string>('citizen-frontend.piwikTrackingId'))
    // nunjucksEnv.addGlobal('piwikTrackingSite', config.get<string>('citizen-frontend.piwikTrackingSite'))
    nunjucksEnv.addGlobal('t', (key: string, options?: TranslationOptions): string => this.i18next.t(key, options))
    nunjucksEnv.addFilter('date', dateFilter)
    nunjucksEnv.addFilter('numeral', numeralFilter)
  }
}
