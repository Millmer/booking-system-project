module "iam" {
  source  = "./aws/iam"
}

output "application-user-name" {
  description = "Application User Name"
  value       = module.iam.application-user-name
}

output "application-user-ses-password" {
  description = "Application User Password"
  value       = module.iam.application-user-ses-password
}

output "application-user-access-key-id" {
  description = "Application User Access Key Id"
  value       = module.iam.application-user-access-key-id
}

output "application-user-secret" {
  description = "Application User Secret"
  value       = module.iam.application-user-secret
}