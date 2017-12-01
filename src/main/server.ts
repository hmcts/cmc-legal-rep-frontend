#!/usr/bin/env node

import { app } from './app'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
const logger = require('@hmcts/nodejs-logging').getLogger('server')

const port: number = parseInt(process.env.PORT, 10) || 4000

if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
  const serverOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  }
  const server = https.createServer(serverOptions, app)
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}/legal`)
  })
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}/legal`)
  })
}
