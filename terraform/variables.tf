variable "AWS_PROFILE" {}
variable "AWS_REGION" {}
variable "GITHUB_USERNAME" {}
variable "GITHUB_TOKEN" {}
variable "JWT_SECRET" {}
variable "PGHOST" {}
variable "PGUSER" {}
variable "PGPASSWORD" {}
variable "PGDATABASE" {}
variable "PGPORT" {}
variable "ROOT_DOMAIN_NAME" {
  type    = string
  default = "company.org" # REDACTED to just company.org
}

locals {
  domain_names = {
    production  = var.ROOT_DOMAIN_NAME
    dev         = "${terraform.workspace}.${var.ROOT_DOMAIN_NAME}"
  }
  domain_name = "${lookup(local.domain_names, terraform.workspace)}"
}