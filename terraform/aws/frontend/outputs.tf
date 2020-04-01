output "frontend_cloudfront_domain_name" {
  value       = aws_cloudfront_distribution.www_distribution.domain_name
}
output "frontend_distribution_bucket" {
  value       = aws_s3_bucket.build_artifacts_bucket.id
}
output "frontend_public_bucket" {
  value       = aws_s3_bucket.www.id
}