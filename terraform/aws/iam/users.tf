resource "aws_iam_user" "application-user" {
  count = terraform.workspace == "production" ? 1 : 0
  name  = "application-user"
}
resource "aws_iam_access_key" "application-user" {
  count = terraform.workspace == "production" ? 1 : 0
  user  = aws_iam_user.application-user.0.name
}

resource "aws_iam_user_policy" "application-user" {
  count = terraform.workspace == "production" ? 1 : 0
  name  = "application-user"
  user  = aws_iam_user.application-user.0.name

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::bookings-image-data-${terraform.workspace}/*"
        },
        {
            "Effect": "Allow",
            "Action": "ecs:*",
            "Resource": "*"
        }
    ]
}
EOF
}