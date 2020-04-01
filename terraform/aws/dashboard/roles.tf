data "aws_iam_policy_document" "codepipeline_assume_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole",
    ]

    principals {
      type = "Service"
      identifiers = [
        "codepipeline.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name               = "${local.pipeline_name}-codepipeline-role-${terraform.workspace}"
  assume_role_policy = data.aws_iam_policy_document.codepipeline_assume_policy.json
}

# CodePipeline policy needed to use CodeBuild
resource "aws_iam_role_policy" "attach_codepipeline_policy" {
  name = "${local.pipeline_name}-codepipeline-policy-${terraform.workspace}"
  role = aws_iam_role.codepipeline_role.id

  policy = <<EOF
{
    "Statement": [
        {
            "Action": [
              "s3:PutObject",
              "s3:DeleteObject",
              "s3:GetObject",
              "s3:GetObjectVersion",
              "s3:GetBucketVersioning"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "cloudwatch:*",
                "sns:*",
                "sqs:*",
                "iam:PassRole"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ],
    "Version": "2012-10-17"
}
EOF
}

# CodeBuild IAM Permissions
resource "aws_iam_role" "codebuild_assume_role" {
  name = "${local.pipeline_name}-codebuild-role-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name = "${local.pipeline_name}-codebuild-policy-${terraform.workspace}"
  role = aws_iam_role.codebuild_assume_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
         "s3:PutObject",
         "s3:DeleteObject",
         "s3:GetObject",
         "s3:GetObjectVersion",
         "s3:GetBucketVersioning"
      ],
      "Resource": "*",
      "Effect": "Allow"
    },
    {
      "Effect": "Allow",
      "Resource": [
        "${aws_codebuild_project.build_project.id}"
      ],
      "Action": [
        "codebuild:*"
      ]
    },
    {
      "Effect":"Allow",
      "Action":[
          "acm:ListCertificates", 
          "cloudfront:GetDistribution",
          "cloudfront:GetStreamingDistribution",
          "cloudfront:GetDistributionConfig",
          "cloudfront:ListDistributions",
          "cloudfront:ListCloudFrontOriginAccessIdentities",
          "cloudfront:CreateInvalidation",
          "cloudfront:GetInvalidation",
          "cloudfront:ListInvalidations",
          "elasticloadbalancing:DescribeLoadBalancers",
          "iam:ListServerCertificates",
          "sns:ListSubscriptionsByTopic",
          "sns:ListTopics",
          "waf:GetWebACL",
          "waf:ListWebACLs"
      ],
      "Resource":"*"
    },
    {
      "Effect": "Allow",
      "Resource": [
        "*"
      ],
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
    }
  ]
}
EOF
}