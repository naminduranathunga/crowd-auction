FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
# 1. Copy pom first and resolve ALL deps + plugins (cached layer)
COPY pom.xml ./
RUN mvn -B dependency:go-offline -Dmaven.test.skip=true || true
# 2. Copy source and build
COPY src ./src
RUN mvn -B -Dmaven.test.skip=true package

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]