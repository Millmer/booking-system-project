output "dashboard_cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.www_distribution.domain_name
}
output "dashboard_distribution_bucket" {
  value       = aws_s3_bucket.build_artifacts_bucket.id
}
output "dashboard_public_bucket" {
  value       = aws_s3_bucket.www.id
}