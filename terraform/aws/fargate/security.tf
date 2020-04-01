# security.tf

# ALB Security Group: Edit to restrict access to the application
resource "aws_security_group" "lb" {
  name        = "bookings-load-balancer-security-group-${terraform.workspace}"
  description = "controls access to the ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = local.app_port
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = local.app_port
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Traffic to the ECS cluster should only come from the proxy server
resource "aws_security_group" "ecs_tasks" {
  name        = "bookings-ecs-tasks-security-group-${terraform.workspace}"
  description = "Allow inbound access from the ALB only" # "Allow inbound access from the proxy server only" - If using proxy server setup 
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = local.app_port
    to_port         = local.app_port
    security_groups = [aws_security_group.lb.id] # [local.proxy_sg_id] - If using proxy server setup 
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "bookings-ecs-tasks-security-group-${terraform.workspace}"
  }
}

resource "aws_security_group" "bookings-db-sg" {
  name        = "RDS PostgreSQL Security Group ${terraform.workspace}"
  description = "Default PostgreSQL Security Group"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 0
    to_port         = 65535
    protocol        = "tcp"
    security_groups = []
    self            = true
  }

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    from_port            = 5432
    to_port              = 5432
    protocol             = "tcp"
    ipv6_cidr_blocks     = ["::/0"]
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name = "RDS PostgreSQL Security Group ${terraform.workspace}"
  }
}