provider "vault" {
  //  # It is strongly recommended to configure this provider through the
  //  # environment variables described above, so that each user can have
  //  # separate credentials set in the environment.
  //  #
  //  # This will default to using $VAULT_ADDR
  //  # But can be set explicitly
  address = "https://vault.reform.hmcts.net:6200"
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
}

module "legal-frontend" {
  source = "git@github.com:contino/moj-module-webapp.git"
  product = "${var.product}-${var.microservice}"
  location = "${var.location}"
  env = "${var.env}"
  ilbIp = "${var.ilbIp}"
  is_frontend  = true
  subscription = "${var.subscription}"

  app_settings = {
    // Node specific vars
    NODE_ENV = "${var.env == "prod" ? "production" : "dev"}"
    UV_THREADPOOL_SIZE = "64"
    NODE_CONFIG_DIR = "D:\\home\\site\\wwwroot\\config"
    TS_BASE_URL = "./src/main"

    // Logging vars
    REFORM_TEAM = "${var.product}"
    REFORM_SERVICE_NAME = "${var.microservice}"
    REFORM_ENVIRONMENT = "${var.env}"

    // Application vars
    GA_TRACKING_ID = "UA-97111056-1"
    POSTCODE_LOOKUP_API_KEY = "${data.vault_generic_secret.postcode-lookup-api-key.data["value"]}"

    // IDAM
    IDAM_API_URL = "${var.idam_api_url}"
    IDAM_AUTHENTICATION_WEB_URL = "${var.authentication_web_url}"
    IDAM_S2S_AUTH = "${var.s2s_url}"
    IDAM_S2S_TOTP_SECRET = "${data.vault_generic_secret.s2s_secret.data["value"]}"
    OAUTH_CLIENT_SECRET = "${data.vault_generic_secret.oauth-client-secret.data["value"]}"

    // Payments API
    PAY_URL = "${var.payments_api_url}"

    // Fees API
    FEES_URL = "${var.fees_api_url}"

    // Draft Store API
    DRAFT_STORE_URL = "${var.draft_store_api_url}"
    DRAFT_STORE_SECRET_PRIMARY = "${data.vault_generic_secret.draft_store_secret.data["primary"]}"
    DRAFT_STORE_SECRET_SECONDARY = "${data.vault_generic_secret.draft_store_secret.data["secondary"]}"

    // Our service dependencies
    CLAIM_STORE_URL = "http://cmc-claim-store-${var.env}.service.${local.aseName}.internal"
    PDF_SERVICE_URL = "http://cmc-pdf-service-${var.env}.service.${local.aseName}.internal"

    // Surveys
    SERVICE_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPT1/"
    FEEDBACK_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPFB/"
    REPORT_PROBLEM_SURVEY_URL = "http://www.smartsurvey.co.uk/s/CMCMVPPB/"

    // Feature toggles
    FEATURE_TESTING_SUPPORT = "${var.env == "prod" ? "false" : "true"}" // Enabled everywhere except prod
    FEATURE_DASHBOARD = "${var.feature_dashboard}"
    FEATURE_IDAM_OAUTH = "${var.feature_idamOauth}"
    FEATURE_CERTIFICATE_OF_SERVICE = "${var.feature_certificateOfService}"
  }
}

module "legal-frontend-vault" {
  source              = "git@github.com:contino/moj-module-key-vault?ref=master"
  name                = "cmc-legal-fe-${var.env}"
  product             = "${var.product}"
  env                 = "${var.env}"
  tenant_id           = "${var.tenant_id}"
  object_id           = "${var.jenkins_AAD_objectId}"
  resource_group_name = "${module.legal-frontend.resource_group_name}"
  product_group_object_id = "68839600-92da-4862-bb24-1259814d1384"
}

