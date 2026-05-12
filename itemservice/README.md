# Item Service

Microservice for managing items in the Crowd Auction system.

## Prerequisites

- **Java 21**
- **Maven**
- **PostgreSQL** (running on `localhost:5432` with database `itemdb`)
- **Apache Kafka** (running on `localhost:9092`)
- **Eureka Server** (running on `localhost:8761`)

## Compilation

To compile the project and download dependencies, run:

```bash
mvn clean compile
```

## Running the Application

To run the application locally:

```bash
mvn spring-boot:run
```

The service will start on port `8081`.

## Database Migrations

This project uses Flyway for database migrations.
- Migrations are located in `src/main/resources/db/migration`.
- Migrations run automatically when the application starts (`spring.flyway.enabled=true`).
- To manually run migrations (if needed via plugin), you can use Maven if the plugin is configured, but the default behavior is automatic on startup.

## Configuration

Configurations are located in `src/main/resources/application.properties`.

Key configurations:
- `server.port`: 8081
- `spring.datasource.url`: `jdbc:postgresql://localhost:5432/itemdb`
- `spring.kafka.bootstrap-servers`: `localhost:9092`
- `eureka.client.service-url.defaultZone`: `http://localhost:8761/eureka/`

Ensure that PostgreSQL, Kafka, and Eureka are running before starting the application, or update the properties to point to your instances.
