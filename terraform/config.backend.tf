# Configure in S3 for keeping track of the TF State
terraform {
  backend "s3" {
    bucket                  = "booking.terraform"
    key                     = "state.tfstate"
    encrypt                 = true
    profile                 = "terraform-booking"
    region                  = "eu-central-1"
  }
}