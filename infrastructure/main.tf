provider "azurerm" {
  version = "<= 1.2.0"
}

provider "vault" {
  //  # It is strongly recommended to configure this provider through the
  //  # environment variables described above, so that each user can have
  //  # separate credentials set in the environment.
  //  #
  //  # This will default to using $VAULT_ADDR
  //  # But can be set explicitly
  address = "https://vault.reform.hmcts.net:6200"
}

data "vault_generic_secret" "cookie-encryption-key" {
  path = "secret/${var.vault_section}/cmc/cookie/encryption-key"
}

data "vault_generic_secret" "s2s_secret" {
  path = "secret/${var.vault_section}/ccidam/service-auth-provider/api/microservice-keys/cmc"
}

data "vault_generic_secret" "draft_store_secret" {
  path = "secret/${var.vault_section}/cmc/draft-store/encryption-secrets/legal-frontend"
}

data "vault_generic_secret" "postcode-lookup-api-key" {
  path = "secret/${var.vault_section}/cmc/postcode-lookup/api-key"
}

data "vault_generic_secret" "oauth-client-secret" {
  path = "secret/${var.vault_section}/ccidam/idam-api/oauth2/client-secrets/cmc-legal"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.product}-legal-fe"
  nonPreviewVaultName = "${var.product}-legal-fe-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

  nonPreviewVaultUri = "${module.legal-frontend-vault.key_vault_uri}"
  previewVaultUri = "https://cmc-legal-fe-aat.vault.azure.net/"
  vaultUri = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultUri : local.nonPreviewVaultUri}"

  s2sUrl = "http://rpe-service-auth-provider-${local.local_env}.service.${local.local_ase}.internal"
  claimStoreUrl = "http://cmc-claim-store-${local.local_env}.service.${local.local_ase}.internal"
  draftStoreUrl = "http://draft-store-service-${local.local_env}.service.${local.local_ase}.internal"
}

module "legal-frontend" {
  source = "git@github.com:hmcts/moj-module-webapp.git?ref=RPE-389/local-cache"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend = "${var.env != "preview" ? 1: 0}"
  appinsights_instrumentation_key = "${var.appinsights_instrumentation_key}"
  subscription = "${var.subscription}"
  additional_host_name = "${var.external_host_name}"
  capacity = "${var.capacity}"

  app_settings = {
    // Node specific vars
    NODE_ENV = "${var.env == "prod" ? "production" : "dev"}"
    UV_THREADPOOL_SIZE = "64"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"
    TS_BASE_URL = "./src"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Application vars
    COOKIE_ENCRYPTION_KEY = "${data.vault_generic_secret.cookie-encryption-key.data["value"]}"
    GA_TRACKING_ID = "${var.ga_tracking_id}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_S2S_AUTH = "${local.s2sUrl}"
    IDAM_S2S_TOTP_SECRET = "${data.vault_generic_secret.s2s_secret.data["value"]}"
    OAUTH_CLIENT_SECRET = "${data.vault_generic_secret.oauth-client-secret.data["value"]}"

    // Payments API
    PAY_URL = "${var.payments_api_url}"

    // Fees API
    FEES_URL = "${var.fees_api_url}"

    // Draft Store API
    DRAFT_STORE_URL = "${local.draftStoreUrl}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.vault_generic_secret.draft_store_secret.data["primary"]}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.vault_generic_secret.draft_store_secret.data["secondary"]}"

    // Our service dependencies
    CLAIM_STORE_URL = "${local.claimStoreUrl}"

    // Surveys
    SERVICE_SURVEY_URL = "${var.feedback_legal_service_survey}"
    FEEDBACK_SURVEY_URL = "${var.feedback_legal_survey}"
    REPORT_PROBLEM_SURVEY_URL = "${var.feedback_legal_report_problem_survey}"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "${var.env == "prod" ? "false" : "true"}" // Enabled everywhere except prod
    FEATURE_DASHBOARD = "${var.feature_dashboard}"
    FEATURE_IDAM_OAUTH = "${var.feature_idamOauth}"
    FEATURE_CERTIFICATE_OF_SERVICE = "${var.feature_certificateOfService}"
    FEATURE_RETURN_ERROR_TO_USER = "${var.feature_return_error_to_user}"
  }
}

module "legal-frontend-vault" {
  source              = "git@github.com:hmcts/moj-module-key-vault?ref=master"
  name                = "${local.vaultName}"
  product             = "${var.product}"
  env                 = "${var.env}"
  tenant_id           = "${var.tenant_id}"
  object_id           = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${module.legal-frontend.resource_group_name}"
  product_group_object_id = "68839600-92da-4862-bb24-1259814d1384"
}
