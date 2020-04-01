module "backend" {
  source     = "./aws/fargate"
  AWS_ACCESS_KEY_ID     = module.iam.application-user-access-key-id
  AWS_SECRET_ACCESS_KEY = module.iam.application-user-secret
  DOMAIN_NAME           = local.domain_name
  JWT_SECRET            = var.JWT_SECRET
  PGHOST                = var.PGHOST
  PGUSER                = var.PGUSER
  PGPASSWORD            = var.PGPASSWORD
  PGDATABASE            = var.PGDATABASE
  PGPORT                = var.PGPORT
  CERT_ARN              = terraform.workspace == "production" ? module.acm.booking_alb_cert_arn : "REDACTED CERT ARN"
}

output "backend_alb_hostname" {
  description = "The ALB host name of the Backend"
  value       = module.backend.alb_hostname
}

output "rds_instance_endpoint" {
  description = "The address of the RDS instance"
  value       = module.backend.rds_instance_endpoint
}

output "rds_instance_name" {
  description = "The database name"
  value       = module.backend.rds_instance_name
}

output "rds_instance_username" {
  description = "The master username for the database"
  value       = module.backend.rds_instance_username
}

output "rds_instance_port" {
  description = "The database port"
  value       = module.backend.rds_instance_port
}