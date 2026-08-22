# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml (supports both root context and backend subfolder context)
COPY pom.xml* backend/pom.xml* ./
RUN mvn dependency:go-offline -B || true

# Copy source code (supports both root context and backend subfolder context)
COPY src* ./src/
COPY backend/src* ./src/

RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
