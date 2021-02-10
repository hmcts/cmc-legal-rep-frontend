provider "azurerm" {
  features {}
}

locals {
  vaultName = "${var.raw_product}-${var.env}"
}

data "azurerm_key_vault" "cmc_key_vault" {
  name = local.vaultName
  resource_group_name = local.vaultName
}

data "azurerm_key_vault_secret" "app_insights_instrumental_key" {
  name = "AppInsightsInstrumentationKey"
  key_vault_id = data.azurerm_key_vault.cmc_key_vault.id
}