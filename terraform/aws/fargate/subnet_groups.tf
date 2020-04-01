resource "aws_db_subnet_group" "aurora-subnet-group" {
  name        = "aurora-subnet-group"
  description = "Main subnet group for Aurora"
  subnet_ids  = aws_subnet.public.*.id

  tags = {
    Name = "bookings-vpc subnet group"
  }
}