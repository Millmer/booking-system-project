resource "aws_s3_bucket" "build_artifacts_bucket" {
  bucket = "${local.pipeline_name}-${terraform.workspace}-artifacts-bucket"
  acl    = "private"
}

resource "aws_s3_bucket" "www" {
  // Our bucket's name is going to be the same as our site's domain name.
  bucket = "${local.www_domain_name}-website"
  // Because we want our site to be available on the internet, we set this so
  // anyone can read this bucket.
  acl = "public-read"
  // We also need to create a policy that allows anyone to view the content.
  // This is basically duplicating what we did in the ACL but it's required by
  // AWS. This post: http://amzn.to/2Fa04ul explains why.
  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::${local.www_domain_name}-website/*"]
    }
  ]
}
EOF

  // S3 understands what it means to host a website.
  website {
    // Here we tell S3 what to use when a request comes in to the root
    // ex. https://www.runatlantis.io
    index_document = "index.html"
    // The page to serve up if a request results in an error or a non-existing
    // page.
    error_document = "index.html"
  }
}

resource "aws_s3_bucket" "bookings_image_data" {
  bucket = "bookings-image-data-${terraform.workspace}"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["POST", "PUT", "DELETE"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  policy = <<EOF
{
  "Version":"2012-10-17",
  "Statement":[
    {
      "Sid":"AddPerm",
      "Effect":"Allow",
      "Principal": "*",
      "Action":["s3:GetObject"],
      "Resource":["arn:aws:s3:::bookings-image-data-${terraform.workspace}/public/*"]
    }
  ]
}
EOF
}

resource "aws_s3_bucket_object" "public" {
  bucket = aws_s3_bucket.bookings_image_data.id
  acl    = "public-read"
  key    = "public/"
  source = "/dev/null"
}