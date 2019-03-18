#!/usr/bin/env node

import './ts-paths-bootstrap'
import * as config from 'config'
import * as propertiesVolume from '@hmcts/properties-volume'
propertiesVolume.addTo(config)

import { AppInsights } from 'modules/app-insights'
import { app } from './app'
import { ApplicationRunner } from './applicationRunner'

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
AppInsights.enable()

ApplicationRunner.run(app)
