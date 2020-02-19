# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:12-alpine as base
RUN yarn config set proxy "$http_proxy" && yarn config set https-proxy "$https_proxy"
COPY package.json yarn.lock ./
RUN yarn install --production \
  && yarn cache clean

# ---- Build image ----
FROM base as build
RUN yarn install
COPY tsconfig.json tsconfig.prod.json gulpfile.js ./
COPY --chown=hmcts:hmcts src/main ./src/main
RUN yarn compile \
  && yarn setup

# ---- Runtime image ----
FROM base as runtime
COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/tsconfig.json $WORKDIR/tsconfig.prod.json ./
COPY config ./config
EXPOSE 4000
CMD [ "yarn", "start-prod" ]
