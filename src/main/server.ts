#!/usr/bin/env node

import './ts-paths-bootstrap'

import { AppInsights } from 'modules/app-insights'
import { app } from './app'
import { ApplicationRunner } from './applicationRunner'

require('@hmcts/properties-volume').addTo(require('config'))

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
AppInsights.enable()

ApplicationRunner.run(app)
