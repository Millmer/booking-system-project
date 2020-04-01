variable "aws_region" {
  description = "The AWS region things are created in"
  default     = "eu-central-1"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default     = "2"
}

variable AWS_ACCESS_KEY_ID {}
variable AWS_SECRET_ACCESS_KEY {}
variable DOMAIN_NAME {}
variable PGHOST {}
variable PGUSER {}
variable PGPASSWORD {}
variable PGDATABASE {}
variable PGPORT {}
variable JWT_SECRET {}

locals {
  env = terraform.workspace

  ### ECR values ###
  max_images_in_ecr = 5
  pipeline_name     = "bookings-backend"

  ### ECS Values ###
  # Service values
  app_name                            = "BookingsBackend"
  app_count                           = 2
  deployment_maximum_percent          = 100
  deployment_minimum_healthy_percent  = 50

  # Task values
  app_port                     = 3000
  health_check_path            = "/health"
  fargate_cpu                  = 256
  fargate_memory               = 512
  ecs_task_execution_role_name = "Bookings_ECSTaskExecutionRole"
  # proxy_sg_id                  = "sg-12345" REDACTED as using full solution


  # Env vars
  root_api_path    = "https://api.${var.DOMAIN_NAME}/api"
  frontend_path    = "https://admin.${var.DOMAIN_NAME}"
  images_root_path = "https://bookings.${var.DOMAIN_NAME}/emails/images"
  bookings_email   = "bookings@${var.DOMAIN_NAME}"

  ### Database Values ###
  master_host     = var.PGHOST
  master_username = var.PGUSER
  master_password = var.PGPASSWORD
  master_db       = var.PGDATABASE
  master_port     = var.PGPORT

  # The type of instance to spin up for this environment
  db_instance_sizes = {
    dev        = "db.t2.micro"
    production = "db.t2.micro"
  }
  instance_type = lookup(local.db_instance_sizes, local.env)

  # The backup retention period for this environment
  db_backup_retention_periods = {
    dev        = 30
    production = 30
  }
  backup_retention_period = lookup(local.db_backup_retention_periods, local.env)
}