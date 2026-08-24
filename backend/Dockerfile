# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy build context and dynamically locate pom.xml & src
COPY . ./context/
RUN if [ -f ./context/pom.xml ]; then \
      cp -rf ./context/* ./; \
    elif [ -f ./context/backend/pom.xml ]; then \
      cp -rf ./context/backend/* ./; \
    fi && rm -rf ./context

RUN mvn dependency:go-offline -B || true
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
