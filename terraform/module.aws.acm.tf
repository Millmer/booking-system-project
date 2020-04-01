module "acm" {
  source     = "./aws/acm"
  AWS_PROFILE = var.AWS_PROFILE
}

output "booking_cert_arn" {
  value = module.acm.booking_cert_arn
}
output "booking_cert_validation_record_name" {
  value = module.acm.booking_cert_validation_record_name
}
output "booking_cert_validation_records" {
  value = module.acm.booking_cert_validation_records
}

output "booking_alb_cert_arn" {
  value = module.acm.booking_alb_cert_arn
}
output "booking_alb_cert_arn" {
  value = module.acm.booking_alb_cert_arn
}
output "booking_alb_cert_validation_records" {
  value = module.acm.booking_alb_cert_validation_records
}