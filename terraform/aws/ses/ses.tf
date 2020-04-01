# email
resource "aws_ses_domain_identity" "bookings_ses" {
  count   = terraform.workspace == "production" ? 1 : 0
  domain  = "company.org" # REDACTED to just company.org
}

resource "aws_ses_domain_dkim" "bookings_dkim" {
  count   = terraform.workspace == "production" ? 1 : 0
  domain  = aws_ses_domain_identity.bookings_ses.0.domain
}

resource "aws_ses_domain_mail_from" "bookings_mail_from" {
  count            = terraform.workspace == "production" ? 1 : 0
  domain           = aws_ses_domain_identity.bookings_ses.0.domain
  mail_from_domain = "mail.${aws_ses_domain_identity.bookings_ses.0.domain}"
}

# This email is used for transactional emails for bookings (confirmation, reminders etc)
resource "aws_ses_email_identity" "bookings-bookings" {
  count = terraform.workspace == "production" ? 1 : 0
  email = "bookings@company.org" # REDACTED to just company.org
}