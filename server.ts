/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT

/
import fs = require('fs')
import { type Request, type Response, type NextFunction } from 'express'
import { CardModel } from './models/card'
import { AddressModel } from './models/address'
import { ChallengeModel } from './models/challenge'
import { BasketItemModel } from './models/basketitem'
import logger from './lib/logger'
import config from 'config'
import path from 'path'
import morgan from 'morgan'
import colors from 'colors/safe'
import * as utils from './lib/utils'

const startTime = Date.now()
const finale = require('finale-rest')
const express = require('express')
const compression = require('compression')
const helmet = require('helmet')
const featurePolicy = require('feature-policy')
const errorhandler = require('errorhandler')
const cookieParser = require('cookie-parser')
const serveIndex = require('serve-index')
const bodyParser = require('body-parser')
const cors = require('cors')
const securityTxt = require('express-security.txt')
const robots = require('express-robots-txt')
const yaml = require('js-yaml')
const swaggerUi = require('swagger-ui-express')
const RateLimit = require('express-rate-limit')
const client = require('prom-client')
const ipfilter = require('express-ipfilter').IpFilter
const swaggerDocument = yaml.load(fs.readFileSync('./swagger.yml', 'utf8'))
const security = require('./lib/insecurity')
const datacreator = require('./data/datacreator')
const app = express()
onst server = require('http').Server(app)
const locales = require('./data/static/locales.json')
const i18n = require('i18n')

const appName = config.get('application.customMetricsPrefix')
const startupGauge = new client.Gauge({
  name: `${appName}_startup_duration_seconds`,
  help: `Duration ${appName} required to perform a certain task during startup`,
  labelNames: ['task']
})

// Wraps the function and measures its (async) execution time
const collectDurationPromise = (name: string, func: any) => {
  return async (...args: any) => {
    const end = startupGauge.startTimer({ task: name })
    const res = await func(...args)
    end()
    return res
  }
}
void collectDurationPromise('validatePreconditions', require('./lib/startup/validatePreconditions'))()
void collectDurationPromise('cleanupFtpFolder', require('./lib/startup/cleanupFtpFolder'))()
void collectDurationPromise('validateConfig', require('./lib/startup/validateConfig'))({})

// Reloads the i18n files in case of server restarts or starts.
async function restoreOverwrittenFilesWithOriginals () {
  await collectDurationPromise('restoreOverwrittenFilesWithOriginals', require('./lib/startup/restoreOverwrittenFilesWithOriginals'))()
}


  /* Security Policy */
  const securityTxtExpiration = new Date()
  securityTxtExpiration.setFullYear(securityTxtExpiration.getFullYear() + 1)

const multer = require('multer')
const uploadToMemory = multer({ storage: multer.memoryStorage(), limits: { fileSize: 200000 } })
const mimeTypeMap: any = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}
const uploadToDisk = multer({
  storage: multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
      const isValid = mimeTypeMap[file.mimetype]
      let error: Error | null = new Error('Invalid mime type')
      if (isValid) {
        error = null
      }
      cb(error, path.resolve('frontend/dist/frontend/assets/public/images/uploads/'))
    },
    filename: (req: Request, file: any, cb: any) => {
      c
      const ext = mimeTypeMap[file.mimetype]
      cb(null, + '-' + Date.now() + '.' + ext)
    }
  })
})

// vuln-code-snippet start exposedMetricsChallenge
/* Serve metrics */
let metricsUpdateLoop: any
const customizeEasterEgg = require('./lib/startup/customizeEasterEgg') // vuln-code-snippet hide-line

// stop server on sigint or sigterm signals
process.on('SIGINT', () => { close(0) })
process.on('SIGTERM', () => { close(0) })
