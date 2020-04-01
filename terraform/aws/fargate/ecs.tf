# ecs.tf

resource "aws_ecs_cluster" "main" {
  name                = "${local.app_name}-${terraform.workspace}"
  capacity_providers  = ["FARGATE_SPOT"]
  default_capacity_provider_strategy {
    base              = 1
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }
}

data "template_file" "bookings_app" {
  template = file("${path.module}/task/main.json")

  vars = {
    aws_access_key_id     = var.AWS_ACCESS_KEY_ID
    aws_secret_access_key = var.AWS_SECRET_ACCESS_KEY
    root_api_path         = local.root_api_path
    frontend_path         = local.frontend_path
    images_root_path      = local.images_root_path
    image_upload_bucket   = "bookings-image-data-${terraform.workspace}"
    bookings_email        = local.bookings_email
    app_name              = "${local.app_name}-${terraform.workspace}"
    app_image             = "${aws_ecr_repository.bookings-ecr.repository_url}:latest"
    app_port              = local.app_port
    log_group             = aws_cloudwatch_log_group.bookings_log_group.name
    fargate_cpu           = local.fargate_cpu
    fargate_memory        = local.fargate_memory
    aws_region            = var.aws_region
    environment           = terraform.workspace
    jwt_secret            = var.JWT_SECRET
    master_host           = aws_db_instance.bookings-db-instance.address # local.master_host (if using proxy solution)
    master_port           = local.master_port
    master_db             = local.master_db
    master_username       = local.master_username
    master_password       = local.master_password
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "bookings-app-task-${terraform.workspace}"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = local.fargate_cpu
  memory                   = local.fargate_memory
  container_definitions    = data.template_file.bookings_app.rendered
}

resource "aws_ecs_service" "main" {
  name                               = "bookings-service-${terraform.workspace}"
  cluster                            = aws_ecs_cluster.main.id
  task_definition                    = aws_ecs_task_definition.app.arn
  desired_count                      = local.app_count
  deployment_maximum_percent         = local.deployment_maximum_percent
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent

  capacity_provider_strategy {
    base              = 1
    capacity_provider = "FARGATE_SPOT"
    weight            = 1
  }

  deployment_controller {
    type = "ECS"
  }

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = aws_subnet.private.*.id
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = "${local.app_name}-${terraform.workspace}"
    container_port   = local.app_port
  }

  # REDACTED - Not using proxy setup solution
  # service_registries {
  #   registry_arn     = aws_service_discovery_service.service_discovery.arn
  # }

  depends_on = [
    aws_alb_listener.http,
    aws_iam_role_policy_attachment.ecs_task_execution_role
  ]
}