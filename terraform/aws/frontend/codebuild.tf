# CodeBuild Section for the Package stage
resource "aws_codebuild_project" "build_project" {
  name          = "${local.pipeline_name}-${terraform.workspace}"
  description   = "The CodeBuild project for ${local.pipeline_name} ${terraform.workspace}"
  service_role  = aws_iam_role.codebuild_assume_role.arn
  build_timeout = "60"

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type = "BUILD_GENERAL1_SMALL"
    image        = "aws/codebuild/nodejs:8.11.0"
    type         = "LINUX_CONTAINER"
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<EOF
version: 0.2
phases:
  build:
    commands:
      - npm install
      - npm run build
  post_build:
    commands:
    - aws s3 sync --delete ./dist/ "s3://${aws_s3_bucket.www.bucket}"
    - aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.www_distribution.id} --paths /index.html
EOF
  }
}
