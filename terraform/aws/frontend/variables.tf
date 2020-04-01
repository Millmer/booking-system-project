variable "PIPELINE_NAME" {
  type    = string
  default = "frontend"
}
variable "GITHUB_USERNAME" {
  type    = string
}
variable "GITHUB_TOKEN" {
  type    = string
}

locals {
  env      = terraform.workspace

  domains  = {
    dev        = "bookings.company.org" # REDACTED to just company.org
    production = "bookings.company.org" # REDACTED to just company.org
  }

  branches = {
    dev        = "dev"
    production = "master"
  }

  pipeline_name   = var.PIPELINE_NAME
  github_username = var.GITHUB_USERNAME
  github_repo     = "fe.bookings.company.org" # REDACTED to fake repo
  github_branch   = "${lookup(local.branches, local.env)}"
  github_token    = var.GITHUB_TOKEN
  www_domain_name = "${lookup(local.domains, local.env)}"
}