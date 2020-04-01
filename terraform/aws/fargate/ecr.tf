resource "aws_ecr_repository" "bookings-ecr" {
  name = "${local.pipeline_name}-${terraform.workspace}"
}
resource "aws_ecr_lifecycle_policy" "bookings-ecr-lifecycle" {
  repository = aws_ecr_repository.bookings-ecr.name
  policy     = <<EOF
        {
        "rules": [
            {
            "rulePriority": 10,
            "description": "Expire images count more than ${local.max_images_in_ecr}",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": ${local.max_images_in_ecr}
            },
            "action": {
                "type": "expire"
            }
            }
        ]
        }
    EOF
}
