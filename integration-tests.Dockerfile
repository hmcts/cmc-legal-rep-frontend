FROM hmctspublic.azurecr.io/base/node:16-alpine as base

USER root
WORKDIR /usr/src/app

COPY --chown=hmcts:hmcts package.json yarn.lock /usr/src/app/

RUN yarn install && yarn cache clean
USER hmcts

COPY tsconfig.json types default.conf.js saucelabs.conf.js /usr/src/app/
COPY ./src/integration-test /usr/src/app/src/integration-test

ENTRYPOINT [ "yarn" ]
CMD [ "test:integration" ]
