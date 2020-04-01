provider "aws" {
  alias                   = "use1"
  shared_credentials_file = "~/.aws/credentials"
  profile                 = var.AWS_PROFILE
  region                  = "us-east-1"
  version                 = "~> 2.0"
}

resource "aws_acm_certificate" "booking_certificate" {
  count             = terraform.workspace == "production" ? 1 : 0
  provider          = aws.use1

  domain_name       = "*.company.org"

  subject_alternative_names = ["*.dev.company.org", "*.bookings.compnay.org", "*.dev.bookings.compmany.org"]

  validation_method = "DNS"

  tags = {
    Project = "Bookings"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "booking_alb_certificate" {
  count             = terraform.workspace == "production" ? 1 : 0

  domain_name       = "*.company.org"

  subject_alternative_names = ["*.dev.company.org"]

  validation_method = "DNS"

  tags = {
    Project = "Bookings"
  }

  lifecycle {
    create_before_destroy = true
  }
}