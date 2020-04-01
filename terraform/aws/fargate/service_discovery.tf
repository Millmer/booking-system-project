# Create a service discovery where ECS tasks will be registered
# and will be able to talk to each other
# resource "aws_service_discovery_private_dns_namespace" "dns_namespace" {
#   name        = "bookings_${terraform.workspace}.internal"
#   description = "Service discovery for ECS cluster ${aws_ecs_cluster.main.name}"
#   vpc         = aws_vpc.main.id
# }

# resource "aws_service_discovery_service" "service_discovery" {
#   name = "_bookings_${terraform.workspace}_service"

#   dns_config {
#     namespace_id = aws_service_discovery_private_dns_namespace.dns_namespace.id

#     dns_records {
#       ttl  = 10
#       type = "A"
#     }

#     routing_policy = "MULTIVALUE"
#   }

#   health_check_custom_config {
#     failure_threshold = 10 # Number of 30-s intervals, so 10 = 30*10 seconds = 5 mins
#   }
# }

# resource "aws_vpc_dhcp_options" "options" {
#   domain_name          = "bookings_${terraform.workspace}.internal"
#   domain_name_servers = ["AmazonProvidedDNS"]
#   tags = {
#     Name = "bookings-dhpc-options-${terraform.workspace}"
#   }
# }

# resource "aws_vpc_dhcp_options_association" "dns_resolver" {
#   vpc_id          = aws_vpc.main.id
#   dhcp_options_id = aws_vpc_dhcp_options.options.id
# }