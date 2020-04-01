# Booking System Project
This repo is a stripped down version of a containerised booking system created for a client. This project contains 4 components. Each component has their own README file that further explain their function.

The system is built to handle bookings from multiple countries across Europe and handle fluctuating load by scaling automatically to handle peak times and seasons. There are super admins that control the system and hosts which own different different locations. All can be configured through the admin CMS (location metadata, opening times, available slots etc) and a custom IAM system for admins to manage hosts and their permissions. Bookings are also managed through the system with cron jobs that trigger automatic emails (confirmation, reminders, host daily updates etc) and booking completion. The project still has room for expansion and is still being activley maintained.

# Code base
- [Backend APIs](./backend): A containerised Express.js server hosting APIs with master/slave mechanism.
- [Admin Dashboard](./dashboard): Vue.js CMS system built with Google's Material Design CMS and rapid application development components to quickly build CRUD interfaces for API endpoints.
- [Infrastucture](./terraform): Terraform project containing all infrastructure and CI/CI pipelines for the project built in AWS (Services listed in the folder).
- FrontEnd: Vue.js app to present booking locations and accept _(I did not build this part - hence the omission)_