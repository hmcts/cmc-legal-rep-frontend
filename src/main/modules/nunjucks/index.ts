import { TranslationOptions } from 'i18next'
import * as path from 'path'
import * as express from 'express'
import * as nunjucks from 'nunjucks'
import * as numeralFilter from 'nunjucks-numeral-filter'
import * as numeral from 'numeral'
import * as config from 'config'

import { NUMBER_FORMAT } from 'app/utils/numberFormatter'
import { convertToPoundsFilter } from 'modules/nunjucks/filters/convertToPounds'
import dateFilter from 'modules/nunjucks/filters/dateFilter'
import { DocumentType } from 'forms/models/documentType'
import { Paths as CertificateOfServicePaths } from 'certificateOfService/paths'
import { FileTypes } from 'forms/models/fileTypes'
import { DefendantDetails } from 'forms/models/defendantDetails'
import { ServiceMethod } from 'forms/models/ServiceMethod'

const packageDotJson = require('../../../../package.json')

const appAssetPaths = {
  js: '/legal/js',
  js_vendor: '/legal/js/lib',
  style: '/legal/stylesheets',
  style_vendor: '/legal/stylesheets/lib',
  images_vendor: '/legal/img/lib'
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
      path.join(__dirname, '..', '..', 'features'),
      path.join(__dirname, '..', '..', 'features', 'certificateOfService', 'views')
    ], {
      autoescape: true,
      express: app
    })

    app.use((req, res, next) => {
      res.locals.pagePath = req.path
      next()
    })

    require('numeral/locales/en-gb')
    numeral.locale('en-gb')
    numeral.defaultFormat(NUMBER_FORMAT)

    nunjucksEnv.addGlobal('asset_paths', appAssetPaths)
    nunjucksEnv.addGlobal('serviceName', 'Money Claim')
    nunjucksEnv.addGlobal('development', this.developmentMode)
    nunjucksEnv.addGlobal('govuk_template_version', packageDotJson.dependencies.govuk_template_jinja)
    nunjucksEnv.addGlobal('customerSurveyUrl', config.get('feedback_legal_service_survey'))
    nunjucksEnv.addGlobal('reportProblemSurveyUrl', config.get('feedback_legal_report_problem_survey'))
    nunjucksEnv.addGlobal('betaFeedbackSurveyUrl', config.get('feedback_legal_survey'))
    nunjucksEnv.addGlobal('t', (key: string, options?: TranslationOptions): string => this.i18next.t(key, options))
    nunjucksEnv.addFilter('numeral', numeralFilter)
    nunjucksEnv.addFilter('date', dateFilter)
    nunjucksEnv.addFilter('pennies2pounds', convertToPoundsFilter)
    nunjucksEnv.addGlobal('DocumentType', DocumentType)
    nunjucksEnv.addGlobal('CertificateOfServicePaths', CertificateOfServicePaths)
    nunjucksEnv.addGlobal('FileTypes', FileTypes)
    nunjucksEnv.addGlobal('ServiceMethod', ServiceMethod)
    nunjucksEnv.addGlobal('defendantDetails', DefendantDetails)
  }
}
