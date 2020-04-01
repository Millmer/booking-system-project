output "alb_hostname" {
  value = aws_alb.main.dns_name
}

output "ecr_repository_url" {
  value = "${aws_ecr_repository.bookings-ecr.repository_url}"
}

output "ecr_repository_arn" {
  value = "${aws_ecr_repository.bookings-ecr.arn}"
}

output "rds_instance_endpoint" {
  description = "The address of the RDS instance"
  value       = aws_db_instance.bookings-db-instance.address
}

output "rds_instance_name" {
  description = "The database name"
  value       = aws_db_instance.bookings-db-instance.name
}

output "rds_instance_username" {
  description = "The master username for the database"
  value       = aws_db_instance.bookings-db-instance.username
}

output "rds_instance_port" {
  description = "The database port"
  value       = aws_db_instance.bookings-db-instance.port
}