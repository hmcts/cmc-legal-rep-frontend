const legalPageDefinitions = require('./src/integration-test/tests/legal/page-definitions')
const supportedBrowsers = require('./src/integration-test/config/saucelabs/supported-browsers').supportedBrowsers

const browser = requiredValue(process.env.SAUCELABS_BROWSER, 'SAUCELABS_BROWSER')
const saucelabsTunnelIdentifier = requiredValue(process.env.SAUCELABS_TUNNEL_IDENTIFIER, 'SAUCELABS_TUNNEL_IDENTIFIER')
const saucelabsUsername = requiredValue(process.env.SAUCELABS_USERNAME, 'SAUCELABS_USERNAME')
const saucelabsAccessKey = requiredValue(process.env.SAUCELABS_ACCESS_KEY, 'SAUCELABS_ACCESS_KEY')

function requiredValue (envVariableValue, variableName) {
  if (envVariableValue && envVariableValue.trim().length > 0) {
    return envVariableValue
  } else {
    throw new Error(`${variableName} is a required environment variable, but wasn't set`)
  }
}

function setupDesiredCapabilitiesFor (browser, saucelabsTunnelName) {
  let desiredCapability = supportedBrowsers[browser]
  desiredCapability.tunnelIdentifier = saucelabsTunnelName
  desiredCapability.tags = ['cmc']
  return desiredCapability
}

exports.config = {
  name: 'integration-tests',
  bootstrap: './src/integration-test/bootstrap/bootstrap.ts',
  tests: './src/integration-test/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
  helpers: {
    WebDriverIO: {
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      browser: supportedBrowsers[browser].browserName,
      waitForTimeout: 60000,
      windowSize: '1600x900',
      uniqueScreenshotNames: true,
      timeouts: {
        script: 60000,
        pageLoad: 60000,
        'page load': 60000
      },
      host: 'ondemand.saucelabs.com',
      port: 80,
      user: saucelabsUsername,
      key: saucelabsAccessKey,
      desiredCapabilities: setupDesiredCapabilitiesFor(browser, saucelabsTunnelIdentifier)
    },
    IdamHelper: {
      require: './src/integration-test/helpers/idamHelper'
    },
    PageHelper: {
      require: './src/integration-test/helpers/pageHelper'
    },
    DownloadPdfHelper: {
      require: './src/integration-test/helpers/downloadPdfHelper'
    },
    SaucelabsReporter: {
      require: './src/integration-test/helpers/saucelabsReporter'
    }
  },
  include: Object.assign({ }, legalPageDefinitions),
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: `./output/${browser}-legal-mocha-junit-reporter-stdout.log`,
        options: {
          mochaFile: `./output/${browser}-legal-e2e-result.xml`,
          reportTitle: `Legal cross browser E2E results for: ${browser}`,
          inlineAssets: true
        }
      },
      'mochawesome': {
        stdout: `./output/${browser}-legal-mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: `${browser}-legal-e2e-result`,
          inlineAssets: true,
          reportTitle: `${browser} legal E2E tests result`
        }
      }
    }
  }
}
