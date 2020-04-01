output "application-user-name" {
  description = "Application User IAM username"
  value       = aws_iam_user.application-user.0.name
}
output "application-user-access-key-id" {
  description = "Access Key Id for the Application User"
  value       = aws_iam_access_key.application-user.0.id
}
output "application-user-secret" {
  description = "Secret Access Key for the Application User"
  value       = aws_iam_access_key.application-user.0.secret
}
output "application-user-ses-password" {
  description = "SES application password for the Application User"
  value       = aws_iam_access_key.application-user.0.ses_smtp_password_v4
}