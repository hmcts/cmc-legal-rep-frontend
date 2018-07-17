data "azurerm_key_vault" "cmc_key_vault" {
  name = "${local.vaultName}"
  resource_group_name = "${local.vaultName}"
}

data "azurerm_key_vault_secret" "cookie_encryption_key" {
  name = "legal-cookie-encryption-key"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "s2s_secret" {
  name = "cmc-s2s-secret"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "draft_store_primary" {
  name = "legal-draft-store-primary"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "draft_store_secondary" {
  name = "legal-draft-store-secondary"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

data "azurerm_key_vault_secret" "oauth_client_secret" {
  name = "legal-oauth-client-secret"
  vault_uri = "${data.azurerm_key_vault.cmc_key_vault.vault_uri}"
}

locals {
  aseName = "${data.terraform_remote_state.core_apps_compute.ase_name[0]}"

  local_env = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "aat" : "saat" : var.env}"
  local_ase = "${(var.env == "preview" || var.env == "spreview") ? (var.env == "preview" ) ? "core-compute-aat" : "core-compute-saat" : local.aseName}"

  previewVaultName = "${var.raw_product}-aat"
  nonPreviewVaultName = "${var.raw_product}-${var.env}"
  vaultName = "${(var.env == "preview" || var.env == "spreview") ? local.previewVaultName : local.nonPreviewVaultName}"

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
  common_tags = "${var.common_tags}"

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
    COOKIE_ENCRYPTION_KEY = "${data.azurerm_key_vault_secret.cookie_encryption_key.value}"
    GA_TRACKING_ID = "${var.ga_tracking_id}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_S2S_AUTH = "${local.s2sUrl}"
    IDAM_S2S_TOTP_SECRET = "${data.azurerm_key_vault_secret.s2s_secret.value}"
    OAUTH_CLIENT_SECRET = "${data.azurerm_key_vault_secret.oauth_client_secret.value}"

    // Payments API
    PAY_URL = "${var.payments_api_url}"

    // Fees API
    FEES_URL = "${var.fees_api_url}"

    // Draft Store API
    DRAFT_STORE_URL = "${local.draftStoreUrl}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.azurerm_key_vault_secret.draft_store_primary.value}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.azurerm_key_vault_secret.draft_store_secondary.value}"

    // Our service dependencies
    CLAIM_STORE_URL = "${local.claimStoreUrl}"

    // Surveys
    FEEDBACK_SURVEY_URL = "${var.feedback_legal_service_survey}"
    FEEDBACK_URL = "${var.feedback_legal_survey}"
    FEEDBACK_REPORT_PROBLEM_URL = "${var.feedback_legal_report_problem_survey}"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "${var.env == "prod" ? "false" : "true"}" // Enabled everywhere except prod
    FEATURE_DASHBOARD = "${var.feature_dashboard}"
    FEATURE_CERTIFICATE_OF_SERVICE = "${var.feature_certificateOfService}"
    FEATURE_RETURN_ERROR_TO_USER = "${var.feature_return_error_to_user}"
  }
}
