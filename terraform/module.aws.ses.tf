module "ses" {
  source  = "./aws/ses"
}

output "domain_identity" {
  description = "SES Domain identity"
  value       = module.ses.domain_identity
}