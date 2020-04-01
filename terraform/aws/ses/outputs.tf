output "domain_identity" {
  description = "SES domain identity"
  value       = aws_ses_domain_identity.bookings_ses.0.arn
}