resource "aws_db_instance" "bookings-db-instance" {
  identifier                = "bookings-database-${terraform.workspace}"
  instance_class            = local.instance_type
  availability_zone         = data.aws_availability_zones.available.names[0]
  engine                    = "postgres"
  engine_version            = "11.5"
  allocated_storage         = 20
  name                      = local.master_db
  username                  = local.master_username
  password                  = local.master_password
  port                      = local.master_port
  vpc_security_group_ids    = [aws_security_group.bookings-db-sg.id]
  db_subnet_group_name      = aws_db_subnet_group.aurora-subnet-group.id
  backup_retention_period   = local.backup_retention_period
  skip_final_snapshot       = true
  final_snapshot_identifier = "bookings-${terraform.workspace}-final"
  publicly_accessible = true
  depends_on          = [aws_internet_gateway.gw]
  tags = {
    Name = "RDS Aurora ${terraform.workspace} platform instance"
  }
}
