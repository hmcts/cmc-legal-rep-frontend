const ProxySettings = require('./src/integration-test/config/proxy-settings').ProxySettings

exports.config = {
  name: 'integration-tests',
  bootstrap: './src/integration-test/bootstrap/bootstrap.ts',
  tests: './src/integration-test/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
  helpers: {
    WebDriverIO: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || '4444',
      browser: process.env.BROWSER || 'chrome',
      url: process.env.CITIZEN_APP_URL || 'https://localhost:3000',
      waitForTimeout: 15000,
      desiredCapabilities: {
        proxy: new ProxySettings()
      }
    },
    IdamHelper: {
      require: './src/integration-test/helpers/idamHelper'
    },
    PageHelper: {
      require: './src/integration-test/helpers/pageHelper'
    },
    DownloadPdfHelper: {
      require: './src/integration-test/helpers/downloadPdfHelper'
    }
  },
  include: Object.assign({ }),
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: './output/legal-mocha-stdout.log',
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './output/legal-integration-result.xml'
        }
      },
      'mochawesome': {
        stdout: `./output/legal-mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: 'legal-e2e-result',
          inlineAssets: true,
          reportTitle: `Legal E2E tests result`
        }
      }
    }
  }
}
