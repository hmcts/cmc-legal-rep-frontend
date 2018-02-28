#!/usr/bin/env node

import './ts-paths-bootstrap'

import { app } from './app'
import { ApplicationRunner } from './applicationRunner'

ApplicationRunner.run(app)
