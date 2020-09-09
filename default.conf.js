require('ts-node/register')
require('tsconfig-paths/register')

const ProxySettings = require('./src/integration-test/config/proxy-settings').ProxySettings

exports.config = {
  name: 'integration-tests',
  bootstrapAll: './src/integration-test/bootstrap/bootstrap.ts',
  tests: './src/integration-test/tests/**/*_test.*',
  output: './output',
  timeout: 10000,
  multiple: {
    parallel: {
      chunks: parseInt(process.env.CHUNKS || '3')
    }
  },
  helpers: {
    WebDriver: {
      host: process.env.WEB_DRIVER_HOST || 'localhost',
      port: process.env.WEB_DRIVER_PORT || 4444,
      browser: process.env.BROWSER || 'chrome',
      url: process.env.LEGAL_APP_URL || 'https://localhost:4000',
      waitForTimeout: 15000,
      restart: false,
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
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {
          steps: true
        }
      },
      'mocha-junit-reporter': {
        stdout: './output/legal-rep-mocha-stdout.log',
        options: {
          mochaFile: process.env.MOCHA_JUNIT_FILE_LOCATION || './output/legal-rep-integration-result.xml'
        }
      },
      'mochawesome': {
        stdout: `./output/legal-rep-mochawesome-stdout.log`,
        options: {
          reportDir: 'output',
          reportFilename: 'legal-rep-e2e-result',
          inlineAssets: true,
          reportTitle: `Legal E2E tests result`
        }
      }
    }
  }
}
