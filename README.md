# CMC legal-rep-frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CMCLFE&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=CMCLFE) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=CMCLFE&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=CMCLFE) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=CMCLFE&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=CMCLFE) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=CMCLFE&metric=coverage)](https://sonarcloud.io/summary/new_code?id=CMCLFE)

This is the frontend application for CMC legal reps.

## Overview

<p align="center">
<a href="https://github.com/hmcts/cmc-citizen-frontend">cmc-citizen-frontend</a> • <b><a href="https://github.com/hmcts/cmc-legal-rep-frontend">cmc-legal-rep-frontend</a></b> • <a href="https://github.com/hmcts/cmc-claim-store">cmc-claim-store</a>
</p>

<br>

<p align="center">
  <img src="https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/c4/cmc/images/structurizr-cmc-overview.png" width="550"/>
</p>
## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >= v10.0.0
* [yarn](https://yarnpkg.com/)
* [Gulp](http://gulpjs.com/)
* [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```

Run:

```bash
$ gulp
```

It will be available at https://localhost:4000

### Running the application on docker (integrated environment)

See the README.md in hmcts/cmc-integration-tests

## Developing

### Code style

We use [TSLint](https://palantir.github.io/tslint/) with [StandardJS](http://standardjs.com/index.html) rules alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
`yarn lint`

### Running the tests

Mocha is used for writing tests.
Run them with:
```bash
$ yarn test
```

For functional testing:
```bash
$ yarn test:routes
```

For accessibilit testing:
```bash
$ yarn test:a11y
```
For code coverage:
```bash
$ yarn test:coverage
```

### Running end to end tests

Integration tests are written using [CodeceptJS](https://codecept.io/) framework and reside in [`src/integration-test`](src/integration-test) directory. They are executed using Docker.

If you want to run them to see if your changes work, you will need to build a docker image containing your updates:

```bash
$ docker-compose build legal-integration-tests
```

Then you can go to the [integration-tests](https://github.com/hmcts/cmc-integration-tests) project and run them with:

```bash
$ ./bin/run-local-legal-tests.sh
```

If you didn't have a dockerized environment running it will be started up for you. If you prefer to start it up yourself beforehand, do:

```bash
$ ./bin/start-local-environment.sh
```

For more details on the dockerized environment please refer to integration-tests repository's[`README`](https://github.com/hmcts/cmc-integration-tests/blob/master/README.md)

## Troubleshooting

### Warnings while running ```yarn install``` on yarn version 1.0.1

There is currently an open issue : https://github.com/yarnpkg/yarn/issues/3751

Example:
```
warning The case-insensitive file C:\CMC\cmc-legal-rep-frontend\node_modules\nyc\node_modules shouldn't be copied twice in one bulk copy
warning The case-insensitive file C:\CMC\cmc-legal-rep-frontend\node_modules\nyc\node_modules\ansi-regex shouldn't be copied twice in one bulk copy

```
