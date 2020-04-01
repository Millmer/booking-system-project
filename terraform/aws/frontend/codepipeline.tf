# Full CodePipeline
resource "aws_codepipeline" "codepipeline" {
  name     = "${local.pipeline_name}-${terraform.workspace}"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    location = aws_s3_bucket.build_artifacts_bucket.bucket
    type     = "S3"
  }

  // We don't want to update the Github token every time
  lifecycle {
    ignore_changes = [stage[0].action[0]]
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["code"]

      configuration = {
        OAuthToken           = local.github_token
        Owner                = local.github_username
        Repo                 = local.github_repo
        Branch               = local.github_branch
        # Prevent AWS to create a github webhook (limit is 20)
        PollForSourceChanges = "true"
      }
    }
  }

  stage {
    name = "DeployToS3"

    action {
      name             = "DeployToS3"
      category         = "Test"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["code"]
      output_artifacts = ["deployed"]
      version          = "1"

      configuration= {
        ProjectName = aws_codebuild_project.build_project.name
      }
    }
  }
}