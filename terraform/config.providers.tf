# This file manages the provider configurations

# AWS Provider
# We use the local credentials file and profile for authentication
provider "aws" {
  profile                 = var.AWS_PROFILE
  region                  = var.AWS_REGION
  version                 = "~> 2.0"
}