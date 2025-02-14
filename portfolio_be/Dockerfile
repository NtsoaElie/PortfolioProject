FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .

RUN ./gradlew build --no-daemon  # Run Gradle build

FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the jar file from the builder image
COPY --from=builder /app/build/libs/*.jar app.jar

# Copy Firebase credentials file
COPY src/main/resources/portfolio-de542-firebase-adminsdk-fbsvc-63773f3e0b.json /app/src/main/resources/

CMD ["java", "-jar", "app.jar"]
