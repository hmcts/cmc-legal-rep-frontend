# CMC legal-rep-frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/cmc-legal-rep-frontend.svg)](https://greenkeeper.io/)
This is the front end for legal representation journey within CMC

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >= v8.9.0
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

It will be available at https://localhost:4000/legal

### Running the application on docker (integrated environment)

See the README.md in hmcts/legal-integration-tests

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
## Troubleshooting

### Warnings while running ```yarn install``` on yarn version 1.0.1

There is currently an open issue : https://github.com/yarnpkg/yarn/issues/3751

Example:
```
warning The case-insensitive file C:\CMC\cmc-legal-rep-frontend\node_modules\nyc\node_modules shouldn't be copied twice in one bulk copy
warning The case-insensitive file C:\CMC\cmc-legal-rep-frontend\node_modules\nyc\node_modules\ansi-regex shouldn't be copied twice in one bulk copy

```
