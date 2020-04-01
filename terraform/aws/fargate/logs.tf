# logs.tf

# Set up CloudWatch group and log stream and retain logs for 30 days
resource "aws_cloudwatch_log_group" "bookings_log_group" {
  name              = "/ecs/bookings-app-${terraform.workspace}"
  retention_in_days = 30

  tags = {
    Name = "bookings-log-group-${terraform.workspace}"
  }
}

resource "aws_cloudwatch_log_stream" "bookings_log_stream" {
  name           = "bookings-log-stream-${terraform.workspace}"
  log_group_name = aws_cloudwatch_log_group.bookings_log_group.name
}