FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app
COPY . .

RUN ./gradlew build --no-daemon  # Run Gradle build

# Debug: List files in the build/libs directory
RUN ls -lah /app/build/libs/

FROM eclipse-temurin:17-jdk
WORKDIR /app

# Try copying the JAR dynamically
COPY --from=builder /app/build/libs/portfolio_be-0.0.1-SNAPSHOT.jar /app/app.jar


CMD ["java", "-jar", "/app/app.jar"]
