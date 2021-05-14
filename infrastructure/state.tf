terraform {
  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.59.0"
    }
    random = {
      source = "hashicorp/random"
    }
  }
}
