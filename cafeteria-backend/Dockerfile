# syntax=docker/dockerfile:1

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/cafeteria-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "\
  if [ -n \"$DATABASE_URL\" ] && [ -z \"$SPRING_DATASOURCE_URL\" ]; then \
    case \"$DATABASE_URL\" in \
      postgres://*|postgresql://*) \
        DB_NO_SCHEME=\"${DATABASE_URL#*://}\"; \
        DB_USERPASS=\"${DB_NO_SCHEME%@*}\"; \
        DB_USER=\"${DB_USERPASS%:*}\"; \
        DB_PASS=\"${DB_USERPASS#*:}\"; \
        DB_HOST_AND_PATH=\"${DB_NO_SCHEME#*@}\"; \
        export SPRING_DATASOURCE_URL=\"jdbc:postgresql://$DB_HOST_AND_PATH\"; \
        [ -z \"$SPRING_DATASOURCE_USERNAME\" ] && export SPRING_DATASOURCE_USERNAME=\"$DB_USER\"; \
        [ -z \"$SPRING_DATASOURCE_PASSWORD\" ] && export SPRING_DATASOURCE_PASSWORD=\"$DB_PASS\"; \
        [ -z \"$SPRING_DATASOURCE_DRIVER_CLASS_NAME\" ] && export SPRING_DATASOURCE_DRIVER_CLASS_NAME=\"org.postgresql.Driver\"; \
        [ -z \"$SPRING_JPA_DATABASE_PLATFORM\" ] && export SPRING_JPA_DATABASE_PLATFORM=\"org.hibernate.dialect.PostgreSQLDialect\"; \
        ;; \
      *) \
        export SPRING_DATASOURCE_URL=\"$DATABASE_URL\"; \
        ;; \
    esac; \
  fi; \
  exec java -jar /app/app.jar"]
