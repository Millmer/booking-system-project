# Use these values to set up a CNAME record on your parent domain
output "booking_cert_arn" {
  value = aws_acm_certificate.booking_certificate[0].arn
}
output "booking_cert_validation_record_name" {
  value = aws_acm_certificate.booking_certificate[0].domain_validation_options.0.resource_record_name
}
output "booking_cert_validation_records" {
  value = [aws_acm_certificate.booking_certificate[0].domain_validation_options.0.resource_record_value]
}

# output "booking_alb_cert_arn" {
#   value = aws_acm_certificate.booking_alb_certificate[0].arn
# }
# output "booking_alb_cert_arn" {
#   value = aws_acm_certificate.booking_alb_certificate[0].domain_validation_options.0.resource_record_name
# }
# output "booking_alb_cert_validation_records" {
#   value = [aws_acm_certificate.booking_alb_certificate[0].domain_validation_options.0.resource_record_value]
# }