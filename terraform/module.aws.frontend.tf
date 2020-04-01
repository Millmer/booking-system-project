# Import all modules that need to be executed
# Booking Frontend static front-end
module "frontend" {
  source          = "./aws/frontend/"
  GITHUB_USERNAME = var.GITHUB_USERNAME
  GITHUB_TOKEN    = var.GITHUB_TOKEN
  CERT_ARN        = terraform.workspace == "production" ? module.acm.booking_cert_arn : "REDACTED CERT ARN"
}

output "frontend_cloudfront_domain_name" {
  description = "The domain name of the Frontend Public Cloudfront distribution"
  value       = module.frontend.frontend_cloudfront_domain_name
}
output "frontend_distribution_bucket" {
  description = "The name of the S3 bucket where Codepipeline stores the build"
  value       = module.frontend.frontend_distribution_bucket
}
output "frontend_public_bucket" {
  description = "The name of the public S3 bucket from which Frontend Public pages are served"
  value       = module.frontend.frontend_public_bucket
}