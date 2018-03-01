#!/usr/bin/env node

import './ts-paths-bootstrap'

import { AppInsights } from 'modules/app-insights'
// App Insights needs to be enabled as early as possible as it monitors other libraries as well
AppInsights.enable()

import { app } from './app'
import { ApplicationRunner } from './applicationRunner'

ApplicationRunner.run(app)
