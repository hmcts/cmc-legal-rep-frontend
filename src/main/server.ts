#!/usr/bin/env node

import { app } from './app'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const port: number = process.env.PORT || 4000

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
  const serverOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  }
  const server = https.createServer(serverOptions, app)
  server.listen(port, () => {
    console.log(`Application started: https://localhost:${port}/legal`)
  })
} else {
  app.listen(port, () => {
    console.log(`Application started: http://localhost:${port}/legal`)
  })
}
