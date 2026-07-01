# Crowd Auction - Docker Compose

This repository contains a small microservice scaffold for the Crowd Auction project. Services included in the Docker Compose stack:

- `postgres` (PostgreSQL)
- `zookeeper` + `kafka` (Apache Kafka)
- `eureka-server` (Eureka discovery server)
- `api-gateway` (Spring Cloud Gateway)
- `authservice`, `bidservice`, `itemservice`, `walletservice` (Spring Boot microservices)

## Prerequisites

- Docker and Docker Compose (v2+) installed
- Java and Maven are only required if you want to build services locally; the Dockerfiles build inside the image using Maven

## Quick start (recommended)

1. Copy the example env file and tweak if necessary:

```powershell
copy .env.example .env
```

2. Build and start the stack:

```powershell
docker compose up --build
```

3. Open the API Gateway at: http://localhost:${GATEWAY_PORT:-8080}
	- Eureka dashboard: http://localhost:${EUREKA_PORT:-8761}

4. Start with scaling up the services

```powershell
docker compose up -d --scale bid-service=2
```

## Notes

- The Dockerfiles use a multi-stage Maven build and expect a standard Maven project layout (pom.xml + src/). They build a runnable jar and run it with `java -jar`.
- Configuration for Spring Boot apps is provided under each service at `src/main/resources/application.yml` and uses environment variables to connect to `postgres`, `kafka`, and `eureka-server`.
- If you prefer building artifacts locally, run `mvn -DskipTests package` in each service and adjust the Dockerfile to copy the built jar instead of running the Maven build inside the image.

If you want, I can (A) adjust the Dockerfiles to use prebuilt jars, (B) add healthchecks to each service image, or (C) wire explicit gateway routes once you have API endpoints defined.

