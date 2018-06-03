// Infrastructural variables
variable "product" {
  default = "cmc"
}

variable "microservice" {
  default = "legal-frontend"
}

variable "location" {
  default = "UK South"
}

variable "env" { }

variable "ilbIp" { }

variable "payments_api_url" {
  default = "https://test.payments.reform.hmcts.net:4421"
}

variable "fees_api_url" {
  default = "https://test.fees-register.reform.hmcts.net:4431"
}

variable "idam_api_url" {
  default = "http://betaDevBccidamAppLB.reform.hmcts.net"
}

variable "authentication_web_url" {
  default = "https://idam-test.dev.ccidam.reform.hmcts.net"
}

variable "subscription" {}

variable "vault_section" {
  default = "test"
}

// feature toggles
variable "feature_dashboard" {
  default = "false"
}

variable "feature_idamOauth" {
  default = "true"
}

variable "feature_certificateOfService" {
  default = "false"
}

variable "feature_return_error_to_user" {
  default = "false"
}

variable "jenkins_AAD_objectId" {
  type                        = "string"
  description                 = "(Required) The Azure AD object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies."
}

variable "tenant_id" {
  description = "(Required) The Azure Active Directory tenant ID that should be used for authenticating requests to the key vault. This is usually sourced from environemnt variables and not normally required to be specified."
}

variable "client_id" {
  description = "(Required) The object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. This is usually sourced from environment variables and not normally required to be specified."
}

variable "external_host_name" {
  default = "moneyclaims-legal.sandbox.platform.hmcts.net"
}

variable "appinsights_instrumentation_key" {
  description = "Instrumentation key of the App Insights instance this webapp should use. Module will create own App Insights resource if this is not provided"
  default = ""
}

variable "ga_tracking_id" {
  description = "Google Analytics tracking ID"
  default = "UA-97111056-3"
}

variable "feedback_legal_service_survey" {
  description = "End of service survey link"
  default = "http://www.smartsurvey.co.uk/s/not-a-real-legal-service-survey/"
}

variable "feedback_legal_report_problem_survey" {
  description = "Report a problem survey link"
  default = "http://www.smartsurvey.co.uk/s/not-a-real-legal-service-survey/"
}

variable "feedback_legal_survey" {
  description = "Report a problem survey link"
  default = "http://www.smartsurvey.co.uk/s/not-a-real-legal-service-survey/"
}

variable "capacity" {
  default = "1"
}
