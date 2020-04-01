# Backend
Back-End Repository for booking system. It servers both the Admin Dashboard and the Booking Frontend.

# Wishlist

- Validation middleware (using something like Joy)
- Add ORM system for easier management of models (Like sequelize)
- Build scripts and automatic deployment pipeline (connecting with AWS CodeBuild and Pipeline)
- Module loader scripts
- Monthly trash collected tracker system (business requirement)

# Local Setup
Run `docker-compose up` in the root of the project.

It will bring up Postgres and the Express application server in development mode.

It binds the application server to `localhost:3000`, this can be re-mapped this by changing the first `3000` in `3000:3000` of `./docker-compose.yaml`).

Postgres is exposed on port `35432` externally. The connection string is `postgres://user:pass@localhost:35432/db` (username, password and database name are defined in `./docker-compose.yaml`).

You can connect to Postgres using the psql client:

`psql postgres://user:pass@localhost:35432/db`

To run the migrations and seeds on the database do
```
docker-compose down
docker-compose run app bash
npm run migrate:latest
npm run seed
```

The default Docker CMD is `npm start`, `./docker-compose.yaml` overrides this to `npm run dev` which runs the application using `nodemon` (auto-restart on file change).

# Express API setup
The Express API is located in `./src/api`.

Applications routes for resources are defined in `./src/api/index.js`.

Global concerns like security, cookie parsing, body parsing and request logging are handled in `./app.js`.

This application loosely follows the Presentation Domain Data Layering:

Presentation and Domain is dealt with in the `./src/api` folder. Data is dealt with in the `./src/persistence` folder.

### To run locally
Run `npm init`
Run `npm run dev` to start service with `nodemon` or `npm start` for no file watching.

# Deploy

Retrieve the login command to use to authenticate your Docker client to your registry.
Use the AWS CLI:
```
$(aws ecr get-login --no-include-email --region eu-central-1 --profile terraform-booking)
```

Note: If you receive an `"Unknown options: --no-include-email"` error when using the AWS CLI, ensure that you have the latest version installed.

Build your Docker image using the following command. You can skip this step if your image is already built:
```
docker build -t booking-backend-production .
```

After the build completes, tag your image so you can push the image to this repository:
```
docker tag booking-backend-production:latest [REDACTED].dkr.ecr.eu-central-1.amazonaws.com/booking-backend-production:latest
```

Run the following command to push this image to your newly created AWS repository:
```
docker push [REDACTED].dkr.ecr.eu-central-1.amazonaws.com/booking-backend-production:latest
```