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
ENTRYPOINT ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && [ -z \"$SPRING_DATASOURCE_URL\" ]; then case \"$DATABASE_URL\" in postgres://*|postgresql://*) DB_NO_SCHEME=\"${DATABASE_URL#*://}\"; DB_HOST_AND_PATH=\"${DB_NO_SCHEME#*@}\"; export SPRING_DATASOURCE_URL=\"jdbc:postgresql://$DB_HOST_AND_PATH\" ;; *) export SPRING_DATASOURCE_URL=\"$DATABASE_URL\" ;; esac; fi; exec java -jar /app/app.jar"]
